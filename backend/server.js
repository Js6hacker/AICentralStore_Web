require('dotenv').config();
const express = require('express');
const cors = require('cors');
const https = require('https');
const { createClient } = require('@supabase/supabase-js');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Telegram notifier helper (asymmetric and non-blocking using node https module)
const sendTelegramNotification = (message) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (!botToken || !chatId) {
    console.log("Telegram notification skipped: Missing env credentials.");
    return;
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
  
  https.get(url, (res) => {
    if (res.statusCode !== 200) {
      console.error(`Telegram notification failed with status code: ${res.statusCode}`);
    }
  }).on('error', (err) => {
    console.error("Telegram notification error:", err.message);
  });
};

// Submission Validation Middleware
const validateSubmission = (req, res, next) => {
  const { name, category, description, website } = req.body;
  
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: "Name is required and must be a non-empty string" });
  }
  if (!category || typeof category !== 'string' || !category.trim()) {
    return res.status(400).json({ error: "Category is required and must be a non-empty string" });
  }
  if (!description || typeof description !== 'string' || !description.trim()) {
    return res.status(400).json({ error: "Description is required and must be a non-empty string" });
  }
  if (!website || typeof website !== 'string' || !website.trim()) {
    return res.status(400).json({ error: "Website URL is required and must be a non-empty string" });
  }
  
  try {
    new URL(website);
  } catch (e) {
    return res.status(400).json({ error: "Website must be a valid URL (e.g. https://chatgpt.com)" });
  }
  
  next();
};

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/ai', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ai_tools')
      .select('*')
      .order('name', { ascending: true });

    sendTelegramNotification("New Visitor");

    if (error) {
      console.error("Supabase error fetching AI tools:", error);
      return res.status(500).json({ error: "Failed to retrieve tools due to a database error." });
    }
    res.json(data);
  } catch (err) {
    console.error("Server error in GET /ai:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Reusable submission handler
const handleSubmission = async (req, res) => {
  const { name, category, description, iconurl, website } = req.body;

  try {
    const { error } = await supabase
      .from('submissions')
      .insert({ name, category, description, iconurl, website });

    if (error) {
      console.error("Supabase error inserting submission:", error);
      return res.status(500).json({ error: "Failed to submit tool due to a database error." });
    }
    
    // Send notification
    sendTelegramNotification(`New AI Tool Submitted: ${name} (${category})`);
    
    res.json({ success: true });
  } catch (err) {
    console.error("Server error in submission:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Handle both standard '/submit' and frontend fallback route '/ai'
app.post('/submit', validateSubmission, handleSubmission);
app.post('/ai', validateSubmission, handleSubmission);

// Razorpay Order Creation Endpoint
app.post('/api/payment/order', async (req, res) => {
  try {
    const { currency = 'USD' } = req.body;
    let amount = 299; // Default $2.99 USD in cents (299 cents)
    
    if (currency === 'INR') {
      amount = 19900; // ₹199 INR in paise (19900 paise)
    }

    const options = {
      amount: amount,
      currency: currency,
      receipt: 'receipt_order_' + Date.now()
    };
    const order = await razorpay.orders.create(options);
    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    res.status(500).json({ error: "Failed to create Razorpay order: " + err.message });
  }
});

// Razorpay Payment Verification Endpoint
app.post('/api/payment/verify', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: "Missing required verification fields." });
  }

  try {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_placeholder')
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      sendTelegramNotification(`App Purchased Successfully!\nOrder ID: ${razorpay_order_id}\nPayment ID: ${razorpay_payment_id}`);
      
      // Attempt to save to Supabase (graceful fail if table doesn't exist)
      try {
        await supabase
          .from('app_payments')
          .insert({
            payment_id: razorpay_payment_id,
            order_id: razorpay_order_id,
            status: 'verified'
          });
      } catch (dbErr) {
        console.warn("Supabase record insert skipped/failed:", dbErr.message);
      }

      res.json({ success: true, message: "Payment verified successfully." });
    } else {
      console.error("Signature mismatch: expected", expectedSignature, "got", razorpay_signature);
      res.status(400).json({ error: "Invalid signature verification failed." });
    }
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ error: "Internal server error during verification." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Backend running on port ' + port);
});
