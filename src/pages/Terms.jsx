import {
  Container,
  Typography,
  Paper,
  Box
} from "@mui/material";
import { Helmet } from "react-helmet-async";

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | AICentralStore</title>
        <meta
          name="description"
          content="Terms of Service for AICentralStore."
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
            sx={{
              p: { xs: 3, md: 6 },
              borderRadius: 4,
              background: "#111827",
              border:
                "1px solid rgba(255,255,255,.08)"
            }}
          >
            <Typography
              variant="h2"
              fontWeight="bold"
              mb={2}
            >
              Terms of Service
            </Typography>

            <Typography
              sx={{
                color: "#94a3b8",
                mb: 5
              }}
            >
              Last Updated: May 2026
            </Typography>

            <Typography variant="h5" mb={2}>
              Acceptance of Terms
            </Typography>

            <Typography
              sx={{
                color: "#cbd5e1",
                lineHeight: 1.9,
                mb: 4
              }}
            >
              By using AI Central Store, you agree
              to comply with these Terms of Service.
            </Typography>

            <Typography variant="h5" mb={2}>
              Website Content
            </Typography>

            <Typography
              sx={{
                color: "#cbd5e1",
                lineHeight: 1.9,
                mb: 4
              }}
            >
              Information about AI tools, software,
              and services is provided for
              informational purposes only. We do not
              guarantee accuracy, availability, or
              suitability of third-party services.
            </Typography>

            <Typography variant="h5" mb={2}>
              Third-Party Links
            </Typography>

            <Typography
              sx={{
                color: "#cbd5e1",
                lineHeight: 1.9,
                mb: 4
              }}
            >
              Our website contains links to
              third-party AI tools and resources.
              We are not responsible for the
              content, security, or practices of
              external websites.
            </Typography>

            <Typography variant="h5" mb={2}>
              Intellectual Property
            </Typography>

            <Typography
              sx={{
                color: "#cbd5e1",
                lineHeight: 1.9,
                mb: 4
              }}
            >
              All website content, branding,
              graphics, and design elements belong
              to AICentralStore unless otherwise
              stated.
            </Typography>

            <Typography variant="h5" mb={2}>
              Limitation of Liability
            </Typography>

            <Typography
              sx={{
                color: "#cbd5e1",
                lineHeight: 1.9,
                mb: 4
              }}
            >
              AICentralStore shall not be liable
              for any damages arising from the use
              of information or third-party
              services featured on this website.
            </Typography>

            <Typography variant="h5" mb={2}>
              Changes to Terms
            </Typography>

            <Typography
              sx={{
                color: "#cbd5e1",
                lineHeight: 1.9
              }}
            >
              We reserve the right to update these
              terms at any time. Continued use of
              the website constitutes acceptance of
              revised terms.
            </Typography>
          </Paper>
        </Container>
      </Box>
    </>
  );
}