import { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Alert
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const sendMessage = async () => {
  setSuccess("");
  setError("");

  if (!name.trim() || !email.trim() || !message.trim()) {
    setError("Please fill all fields.");
    return;
  }

  if (!isValidEmail(email)) {
    setError("Please enter a valid email address.");
    return;
  }

  if (message.trim().length < 10) {
    setError("Message is too short.");
    return;
  }

  try {
    setLoading(true);

    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        from_name: name,
        from_email: email,
        message
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );

    setSuccess("Message sent successfully!");

    setName("");
    setEmail("");
    setMessage("");
  } catch (err) {
    console.error(err);
    setError("Failed to send message.");
  } finally {
    setLoading(false);
  }
};
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

  return (
    <>
      <Helmet>
        <title>Contact Us | AICentralStore</title>

        <meta
          name="description"
          content="Contact AICentralStore for support, partnerships, AI tool submissions, and feedback."
        />
      </Helmet>

      <Box
        sx={{
          pt: 12,
          pb: 8,
          background:
            "linear-gradient(180deg,#0b0f19,#111827)"
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 6 },
              borderRadius: 4,
              background: "#111827",
              border:
                "1px solid rgba(255,255,255,0.08)"
            }}
          >
            <Typography
              variant="h2"
              fontWeight="bold"
              mb={2}
            >
              Contact Us
            </Typography>

            <Typography
              sx={{
                color: "#94a3b8",
                mb: 5,
                lineHeight: 1.8
              }}
            >
              Have a question, partnership request,
              AI tool submission, or feedback?
              We'd love to hear from you.
            </Typography>

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
            />

            <TextField
              fullWidth
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              error={email.length > 0 && !isValidEmail(email)}
            helperText={
                email.length > 0 && !isValidEmail(email)
                ? "Enter a valid email address"
                : ""
            }
            />

            <TextField
              fullWidth
              multiline
              rows={6}
              label="Message"
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              margin="normal"
            />

            <Button
              variant="contained"
              size="large"
              onClick={sendMessage}
              disabled={loading}
              sx={{
                mt: 3,
                px: 4,
                py: 1.3,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: "bold"
              }}
            >
              {loading
                ? "Sending..."
                : "Send Message"}
            </Button>

            {/* <Box mt={6}>
              <Typography
                variant="h5"
                fontWeight="bold"
                mb={2}
              >
                Other Ways to Reach Us
              </Typography>

              <Typography color="#cbd5e1">
                Email:
                contact@aicentralstore.com
              </Typography>

              <Typography color="#cbd5e1">
                Website:
                https://www.aicentralstore.com
              </Typography>
            </Box> */}
          </Paper>
        </Container>
      </Box>
    </>
  );
}