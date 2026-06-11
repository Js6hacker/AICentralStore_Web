import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import AndroidIcon from "@mui/icons-material/Android";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DownloadIcon from "@mui/icons-material/Download";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import StarIcon from "@mui/icons-material/Star";
import { motion } from "framer-motion";

export default function DownloadApp() {
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState("");
  const [paymentId, setPaymentId] = useState("");

  // Check if user has already paid in the past & pre-load script
  useEffect(() => {
    const verified = localStorage.getItem("apk_payment_verified");
    const storedPaymentId = localStorage.getItem("apk_payment_id");
    if (verified === "true") {
      setPaid(true);
      if (storedPaymentId) {
        setPaymentId(storedPaymentId);
      }
    }
    loadRazorpay();
  }, []);

  // Dynamically load Razorpay checkout script
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        existingScript.onload = () => resolve(true);
        existingScript.onerror = () => resolve(false);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const triggerDownload = (token) => {
    if (!token) {
      setError("Download token missing. Please request a new link.");
      return;
    }
    const API_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:3000"
      : import.meta.env.VITE_API_URL;

    const link = document.createElement("a");
    link.href = `${API_URL}/api/download-app?token=${token}`;
    link.setAttribute("download", "aicentralstore.apk");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetPurchase = () => {
    localStorage.removeItem("apk_payment_verified");
    localStorage.removeItem("apk_payment_id");
    setPaid(false);
    setPaymentId("");
    setError("");
  };

  const handleDownloadAgain = async () => {
    setLoading(true);
    setError("");
    try {
      const storedPaymentId = localStorage.getItem("apk_payment_id");
      if (!storedPaymentId) {
        throw new Error("No payment record found. Please verify your purchase.");
      }

      const API_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://localhost:3000"
        : import.meta.env.VITE_API_URL;

      const res = await fetch(`${API_URL}/api/payment/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: storedPaymentId })
      });

      if (!res.ok) {
        throw new Error("Failed to verify purchase history.");
      }

      const data = await res.json();
      if (data.success && data.token) {
        triggerDownload(data.token);
      } else {
        throw new Error(data.error || "Unable to retrieve download link.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        throw new Error("Razorpay SDK failed to load. Please verify your connection.");
      }

      // Check if we are running locally on localhost, default to localhost backend
      const API_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://localhost:3000"
        : import.meta.env.VITE_API_URL;

      const res = await fetch(`${API_URL}/api/payment/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) {
        throw new Error("Unable to create order. Please try again later.");
      }

      const orderData = await res.json();
      if (!orderData.success) {
        throw new Error(orderData.error || "Order creation failed.");
      }

      const options = {
        key: orderData.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SzqENT8z28CQAg",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "AICentralStore App",
        description: "One-time payment to download the Android APK",
        image: "/icon.png",
        order_id: orderData.orderId,
        handler: async function (response) {
          setLoading(true);
          try {
            const verifyRes = await fetch(`${API_URL}/api/payment/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            if (!verifyRes.ok) {
              throw new Error("Signature validation failed.");
            }

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setPaid(true);
              setPaymentId(response.razorpay_payment_id);
              localStorage.setItem("apk_payment_verified", "true");
              localStorage.setItem("apk_payment_id", response.razorpay_payment_id);
              triggerDownload(verifyData.token);
            } else {
              throw new Error(verifyData.error || "Verification failed.");
            }
          } catch (verErr) {
            setError(verErr.message);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: "AICentralStore Customer",
          email: "customer@aicentralstore.com",
          contact: "9999999999"
        },
        theme: {
          color: "#6366f1"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        setError("Payment process cancelled or failed: " + response.error.description);
      });
      rzp.open();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Download Android App - AICentralStore</title>
        <meta
          name="description"
          content="Download the official AICentralStore Android application to browse and explore top AI tools on the go."
        />
      </Helmet>

      {/* HERO SECTION */}
      <Box
        sx={{
          pt: 15,
          pb: 8,
          background: "linear-gradient(135deg, #09090e 30%, #111827 70%, #1e1b4b 100%)",
          textAlign: "center"
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box
              sx={{
                display: "inline-flex",
                p: 2,
                borderRadius: "50%",
                background: "rgba(99, 102, 241, 0.15)",
                mb: 3,
                boxShadow: "0 0 30px rgba(99, 102, 241, 0.3)"
              }}
            >
              <AndroidIcon sx={{ fontSize: 50, color: "#818cf8" }} />
            </Box>
            <Typography
              variant="h2"
              fontWeight="bold"
              gutterBottom
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontFamily: "'Outfit', sans-serif",
                background: "linear-gradient(90deg, #ffffff 0%, #a5b4fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              AICentralStore Mobile
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ maxW: 600, mx: "auto", mb: 4, px: 2, fontSize: "1.1rem" }}
            >
              Take the ultimate AI Directory and resources store with you. Access
              thousands of artificial intelligence tools and premium blogs anywhere.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* CONTENT & PURCHASE SECTION */}
      <Container maxWidth="lg" sx={{ pb: 12 }}>
        <Grid container spacing={5} alignItems="stretch">

          {/* FEATURES GRID */}
          <Grid item xs={12} md={7}>
            <Typography
              variant="h4"
              fontWeight="bold"
              mb={4}
              sx={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Why Get the Android App?
            </Typography>

            <Grid container spacing={3}>
              {[
                {
                  icon: <SpeedIcon sx={{ color: "#60a5fa" }} />,
                  title: "Blazing Fast Speed",
                  desc: "Fully cached tool catalog and asset bundle for immediate page transitions and minimal load times."
                },
                {
                  icon: <NotificationsActiveIcon sx={{ color: "#f43f5e" }} />,
                  title: "Push Notifications",
                  desc: "Be the first to learn when new AI categories, reviews, or trending developer tools are published."
                },
                {
                  icon: <OfflineBoltIcon sx={{ color: "#fbbf24" }} />,
                  title: "Offline Ready",
                  desc: "Explore your saved and viewed tools offline. Safe storage on your device means no connection drops."
                },
                {
                  icon: <SecurityIcon sx={{ color: "#34d399" }} />,
                  title: "Secure & Encrypted",
                  desc: "A lightweight, secure wrapper protecting user information with biometric passkey features."
                }
              ].map((feat, idx) => (
                <Grid item xs={12} sm={6} key={idx}>
                  <Paper
                    sx={{
                      p: 3,
                      height: "100%",
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      borderRadius: 4,
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 10px 30px rgba(99, 102, 241, 0.1)",
                        borderColor: "rgba(99, 102, 241, 0.2)"
                      }
                    }}
                  >
                    <Box sx={{ mb: 2 }}>{feat.icon}</Box>
                    <Typography variant="h6" fontWeight="bold" mb={1}>
                      {feat.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                      {feat.desc}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* CHECKOUT CARD */}
          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{ height: "100%" }}
            >
              <Paper
                sx={{
                  p: 4,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  background: "rgba(99, 102, 241, 0.03)",
                  border: "1px solid rgba(99, 102, 241, 0.15)",
                  borderRadius: 6,
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 15px 40px rgba(99, 102, 241, 0.05)"
                }}
              >
                {/* Decorative glow overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    top: -100,
                    right: -100,
                    width: 200,
                    height: 200,
                    background: "rgba(99, 102, 241, 0.2)",
                    filter: "blur(50px)",
                    borderRadius: "50%",
                    pointerEvents: "none"
                  }}
                />

                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography
                      variant="overline"
                      fontWeight="bold"
                      color="primary.light"
                      letterSpacing="1px"
                    >
                      Instant APK File
                    </Typography>
                    <StarIcon sx={{ color: "#fbbf24" }} />
                  </Box>

                  <Typography variant="h4" fontWeight="bold" mb={2}>
                    AICentralStore App
                  </Typography>

                  <Typography variant="body2" color="text.secondary" mb={3} lineHeight={1.6}>
                    Secure one-time payment for lifetime access. Includes future upgrades and premium releases. Can be downloaded instantly in every country.
                  </Typography>

                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h3" fontWeight="bold" component="span">
                      $1.99
                    </Typography>
                    <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
                      / lifetime
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 1, color: "primary.light", fontWeight: 500 }}>
                       *International cards are converted automatically by your bank.
                    </Typography>
                  </Box>

                  <List sx={{ mb: 4, p: 0 }}>
                    {[
                      "Ad-free complete catalog",
                      "Instant offline capabilities",
                      "Unlimited downloads & updates",
                      "Global accessibility key"
                    ].map((item, idx) => (
                      <ListItem key={idx} sx={{ p: 0, mb: 1 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon sx={{ color: "#34d399", fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={item}
                          primaryTypographyProps={{ variant: "body2", fontWeight: 500 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Box>
                  {error && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                      {error}
                    </Alert>
                  )}

                  {!paid ? (
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handlePayment}
                      disabled={loading}
                      sx={{
                        py: 1.8,
                        borderRadius: 3,
                        fontWeight: "bold",
                        background: "linear-gradient(90deg, #6366f1 0%, #4f46e5 100%)",
                        boxShadow: "0 4px 15px rgba(99, 102, 241, 0.4)",
                        "&:hover": {
                          background: "linear-gradient(90deg, #4f46e5 0%, #4338ca 100%)"
                        }
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} sx={{ color: "white" }} />
                      ) : (
                        "Unlock App & Download"
                      )}
                    </Button>
                  ) : (
                    <Box sx={{ textAlign: "center" }}>
                      <Alert severity="success" sx={{ mb: 2, borderRadius: 2, textAlign: "left" }}>
                        Payment Verified Successfully! (Payment ID: {paymentId.substring(0, 12)}...)
                      </Alert>
                      <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        onClick={handleDownloadAgain}
                        disabled={loading}
                        startIcon={<DownloadIcon />}
                        sx={{
                          py: 1.8,
                          borderRadius: 3,
                          fontWeight: "bold",
                          boxShadow: "0 4px 15px rgba(52, 211, 153, 0.4)",
                          mb: 2
                        }}
                      >
                        Download APK Again
                      </Button>
                      <Button
                        variant="outlined"
                        color="inherit"
                        fullWidth
                        onClick={handleResetPurchase}
                        sx={{
                          py: 1.5,
                          borderRadius: 3,
                          borderColor: "rgba(255, 255, 255, 0.15)",
                          color: "text.secondary",
                          fontWeight: "bold",
                          "&:hover": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                            color: "white",
                            background: "rgba(255, 255, 255, 0.02)"
                          }
                        }}
                      >
                        Reset & Purchase Again
                      </Button>
                    </Box>
                  )}

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", textAlign: "center", mt: 2 }}
                  >
                    Protected by Razorpay 256-bit encryption.
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

        </Grid>
      </Container>
    </>
  );
}
