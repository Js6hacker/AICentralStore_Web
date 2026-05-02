import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#6366f1" },
    background: { default: "#0f172a", paper: "rgba(255,255,255,0.06)" }
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: "Inter, system-ui, Arial"
  }
});

export default theme;