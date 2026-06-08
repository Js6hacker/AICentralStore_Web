import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6366f1",
      light: "#818cf8",
      dark: "#4f46e5"
    },
    secondary: {
      main: "#06b6d4",
      light: "#22d3ee",
      dark: "#0891b2"
    },
    background: {
      default: "#09090e",
      paper: "rgba(255, 255, 255, 0.03)"
    },
    text: {
      primary: "#f8fafc",
      secondary: "#94a3b8"
    }
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: "'Outfit', 'Inter', system-ui, Arial, sans-serif",
    h1: { fontFamily: "'Outfit', sans-serif", fontWeight: 800 },
    h2: { fontFamily: "'Outfit', sans-serif", fontWeight: 700 },
    h3: { fontFamily: "'Outfit', sans-serif", fontWeight: 700 },
    h4: { fontFamily: "'Outfit', sans-serif", fontWeight: 600 },
    h5: { fontFamily: "'Outfit', sans-serif", fontWeight: 600 },
    h6: { fontFamily: "'Outfit', sans-serif", fontWeight: 600 },
    button: { fontFamily: "'Outfit', sans-serif", fontWeight: 600, textTransform: "none" }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "10px 24px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)"
          }
        },
        containedSecondary: {
          "&:hover": {
            boxShadow: "0 4px 12px rgba(6, 182, 212, 0.3)"
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          backdropFilter: "blur(12px)"
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            transition: "all 0.3s ease",
            "& fieldset": {
              border: "none"
            },
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.15)"
            },
            "&.Mui-focused": {
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1.5px solid #6366f1",
              boxShadow: "0 0 16px rgba(99, 102, 241, 0.15)"
            }
          }
        }
      }
    }
  }
});

export default theme;