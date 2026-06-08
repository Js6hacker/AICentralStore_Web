import { useState } from "react";
import { submitAI } from "../services/api";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  Alert,
  CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AICard from "../components/AICard";
import PreviewIcon from "@mui/icons-material/RemoveRedEye";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export default function SubmitAI() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    website: "",
    iconurl: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (field) => (e) => {
    setForm({
      ...form,
      [field]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Basic Validation
    if (!form.name.trim()) return setError("Name is required");
    if (!form.category.trim()) return setError("Category is required");
    if (!form.description.trim()) return setError("Description is required");
    if (!form.website.trim()) return setError("Website URL is required");

    try {
      new URL(form.website);
    } catch {
      return setError("Enter a valid website URL (e.g. https://chatgpt.com)");
    }

    try {
      setLoading(true);
      const res = await submitAI(form);
      if (res) {
        setSuccess(true);
        // Clear form
        setForm({
          name: "",
          category: "",
          description: "",
          website: "",
          iconurl: ""
        });
      } else {
        setError("Something went wrong during submission.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to submit tool.");
    } finally {
      setLoading(false);
    }
  };

  // Build the mock AI object for preview
  const previewAI = {
    name: form.name.trim() || "AI Tool Name",
    category: form.category.trim() || "Category",
    description: form.description.trim() || "Provide a brief description to see it previewed here in real-time.",
    website: form.website.trim() || "https://example.com",
    iconurl: form.iconurl.trim()
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 12, pb: 8 }}>
      <Grid container spacing={4} alignItems="stretch">

        {/* Left Column: Form */}
        <Grid item xs={12} md={7}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              height: "100%",
              display: "flex",
              flexDirection: "column",
              background: "rgba(255, 255, 255, 0.015)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: 5
            }}
          >
            <Box mb={4}>
              <Typography variant="h4" fontWeight="800" sx={{ fontFamily: "Outfit, sans-serif", letterSpacing: "-0.5px" }}>
                Submit an AI Tool 🚀 (Currently on work)
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Suggest a new artificial intelligence platform to be added to our curated directory.
              </Typography>
            </Box>

            {success && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 3, fontWeight: 600 }}>
                Submitted successfully! Your tool will appear on the Home Page directory.
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 3, fontWeight: 600 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
              <TextField
                fullWidth
                label="Tool Name"
                value={form.name}
                onChange={handleChange("name")}
                placeholder="e.g. ChatGPT, Gemini"
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Category"
                value={form.category}
                onChange={handleChange("category")}
                placeholder="e.g. Chatbot, Writing, Image Generator"
                variant="outlined"
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={form.description}
                onChange={handleChange("description")}
                placeholder="Brief description explaining what this AI tool does..."
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Website URL"
                value={form.website}
                onChange={handleChange("website")}
                placeholder="e.g. https://chatgpt.com"
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Icon URL (Optional)"
                value={form.iconurl}
                onChange={handleChange("iconurl")}
                placeholder="Custom favicon link, or leave blank to fetch domain default"
                variant="outlined"
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddCircleIcon />}
                sx={{
                  mt: 2,
                  py: 1.6,
                  fontFamily: "Outfit, sans-serif",
                  fontWeight: 700,
                  fontSize: "15px",
                  background: "linear-gradient(90deg, #6366f1 0%, #4f46e5 100%)",
                  "&:hover": {
                    background: "linear-gradient(90deg, #4f46e5 0%, #4338ca 100%)"
                  }
                }}
              >
                {loading ? "Submitting..." : "Submit Tool"}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column: Preview */}
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              p: { xs: 3, md: 5 },
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              background: "rgba(255, 255, 255, 0.01)",
              borderRadius: 5,
              border: "1px solid rgba(255, 255, 255, 0.04)",
              position: "relative"
            }}
          >
            <Box mb={4}>
              <Typography
                variant="h6"
                fontWeight="800"
                sx={{
                  fontFamily: "Outfit, sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  letterSpacing: "-0.5px"
                }}
              >
                <PreviewIcon color="primary" /> Live Card Preview
              </Typography>
              <Typography color="text.secondary" fontSize="14px" sx={{ mt: 0.5 }}>
                Check how your submission card displays in real-time.
              </Typography>
            </Box>

            {/* Simulated Grid centering the Card */}
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: { xs: 4, md: 6 },
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  width: "150px",
                  height: "150px",
                  background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)",
                  filter: "blur(20px)",
                  zIndex: 0
                }
              }}
            >
              <Box sx={{ width: "100%", maxWidth: 320, zIndex: 1 }}>
                <AICard ai={previewAI} />
              </Box>
            </Box>

            <Box sx={{ mt: 3, pt: 3, borderTop: "1px solid rgba(255, 255, 255, 0.05)", textAlign: "center" }}>
              <Typography color="text.secondary" fontSize="12px">
                Note: Standard submissions automatically scrape the domain favicon using our lookup API when rendered.
              </Typography>
            </Box>
          </Box>
        </Grid>

      </Grid>
    </Container>
  );
}