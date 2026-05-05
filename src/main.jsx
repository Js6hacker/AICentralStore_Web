import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { HelmetProvider } from "react-helmet-async";


const theme = createTheme({
  palette: { mode: "dark", primary: { main: "#6366f1" } }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
     <HelmetProvider>
    <App />
  </HelmetProvider>
  </ThemeProvider>
);

