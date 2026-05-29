import { Box, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <Box
      sx={{
        py: 3,
        borderTop: "1px solid rgba(255,255,255,0.08)",
        background:
          "linear-gradient(90deg,#0b0f19,#111827)"
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2
          }}
        >
          <Typography
            sx={{
              color: "#cbd5e1",
              fontWeight: 500
            }}
          >
            © {new Date().getFullYear()} AICentralStore
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 4
            }}
          >
            <Link
              to="/about"
              style={{
                color: "#94a3b8",
                textDecoration: "none"
              }}
            >
              About
            </Link>

            <Link
              to="/privacy-policy"
              style={{
                color: "#94a3b8",
                textDecoration: "none"
              }}
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              style={{
                color: "#94a3b8",
                textDecoration: "none"
              }}
            >
              Terms of Service
            </Link>
            <Link
              to="/contact"
              style={{
                color: "#94a3b8",
                textDecoration: "none"
              }}
            >
              Contact
            </Link>
            
          </Box>
        </Box>
      </Container>
    </Box>
  );
}