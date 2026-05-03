import { AppBar, Toolbar, Typography, Box } from "@mui/material";

export default function Navbar() {
  return (
    <AppBar
      position="fixed"
      sx={{
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(10px)"
      }}
    >
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          
          {/* LOGO */}
          <img
            src="/icon.png"
            alt="logo"
            width="28"
            style={{ borderRadius: "6px" }}
          />

          {/* TITLE */}
          <Typography fontWeight="bold">
            AICentralStore
          </Typography>

        </Box>
      </Toolbar>
    </AppBar>
  );
}