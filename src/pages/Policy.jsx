import {
  Container,
  Typography,
  Paper,
  Box
} from "@mui/material";
import { Helmet } from "react-helmet-async";

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | AI Central Store</title>

        <meta
          name="description"
          content="Privacy Policy for AI Central Store. Learn how we collect, use, and protect your information."
        />
      </Helmet>

      <Box
        sx={{
          minHeight: "70vh",
          pt: 12,
          pb: 4,
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
              Privacy Policy
            </Typography>

            <Typography
              sx={{
                color: "#94a3b8",
                mb: 5
              }}
            >
              Last Updated: May 2026
            </Typography>

            <Typography
              variant="h5"
              fontWeight="bold"
              mb={2}
            >
              Information We Collect
            </Typography>

            <Typography
              sx={{
                color: "#cbd5e1",
                lineHeight: 1.9,
                mb: 4
              }}
            >
              AI Central Store may collect
              anonymous usage information,
              analytics data, and technical
              information such as browser type,
              device information, and page visits
              to improve the user experience.
            </Typography>

            <Typography
              variant="h5"
              fontWeight="bold"
              mb={2}
            >
              How We Use Information
            </Typography>

            <Typography
              sx={{
                color: "#cbd5e1",
                lineHeight: 1.9,
                mb: 4
              }}
            >
              Information collected is used to
              improve our website, analyze traffic
              trends, enhance performance, and
              provide better recommendations of AI
              tools and resources.
            </Typography>

            <Typography
              variant="h5"
              fontWeight="bold"
              mb={2}
            >
              Cookies
            </Typography>

            <Typography
              sx={{
                color: "#cbd5e1",
                lineHeight: 1.9,
                mb: 4
              }}
            >
              We may use cookies and similar
              technologies to remember preferences,
              improve navigation, and analyze site
              usage. You can disable cookies
              through your browser settings.
            </Typography>

            <Typography
              variant="h5"
              fontWeight="bold"
              mb={2}
            >
              Third-Party Services
            </Typography>

            <Typography
              sx={{
                color: "#cbd5e1",
                lineHeight: 1.9,
                mb: 4
              }}
            >
              AI Central Store may use third-party
              services such as Google Analytics,
              advertising networks, affiliate
              platforms, and embedded content
              providers. These services may collect
              information according to their own
              privacy policies.
            </Typography>

            <Typography
              variant="h5"
              fontWeight="bold"
              mb={2}
            >
              Data Security
            </Typography>

            <Typography
              sx={{
                color: "#cbd5e1",
                lineHeight: 1.9,
                mb: 4
              }}
            >
              We take reasonable measures to
              protect information from unauthorized
              access, alteration, disclosure, or
              destruction. However, no internet
              transmission can be guaranteed 100%
              secure.
            </Typography>

            <Typography
              variant="h5"
              fontWeight="bold"
              mb={2}
            >
              Changes to This Policy
            </Typography>

            <Typography
              sx={{
                color: "#cbd5e1",
                lineHeight: 1.9,
                mb: 4
              }}
            >
              We may update this Privacy Policy
              from time to time. Changes will be
              posted on this page with an updated
              revision date.
            </Typography>

            <Typography
              variant="h5"
              fontWeight="bold"
              mb={2}
            >
              Contact Us
            </Typography>

            <Typography
              sx={{
                color: "#cbd5e1",
                lineHeight: 1.9
              }}
            >
              If you have any questions regarding
              this Privacy Policy, please contact
              us through the website contact page.
            </Typography>
          </Paper>
        </Container>
      </Box>
    </>
  );
}