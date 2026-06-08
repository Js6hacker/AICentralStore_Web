import { Box } from "@mui/material";
import { motion } from "framer-motion";

export default function GlowBackground({ children }) {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
        background: "#05050b",
        color: "text.primary",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Glow Orbs */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden"
        }}
      >
        {/* Orb 1: Indigo */}
        <Box
          component={motion.div}
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -50, 30, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          sx={{
            position: "absolute",
            width: { xs: 300, md: 500 },
            height: { xs: 300, md: 500 },
            top: "-10%",
            left: "-5%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%)",
            filter: "blur(40px)"
          }}
        />

        {/* Orb 2: Cyan */}
        <Box
          component={motion.div}
          animate={{
            x: [0, -30, 40, 0],
            y: [0, 60, -40, 0],
            scale: [1, 0.9, 1.1, 1]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          sx={{
            position: "absolute",
            width: { xs: 250, md: 450 },
            height: { xs: 250, md: 450 },
            bottom: "10%",
            right: "-10%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, rgba(6, 182, 212, 0) 70%)",
            filter: "blur(50px)"
          }}
        />

        {/* Orb 3: Deep Violet */}
        <Box
          component={motion.div}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, 30, -50, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
          sx={{
            position: "absolute",
            width: { xs: 200, md: 400 },
            height: { xs: 200, md: 400 },
            top: "40%",
            left: "50%",
            transform: "translateX(-50%)",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.07) 0%, rgba(168, 85, 247, 0) 70%)",
            filter: "blur(60px)"
          }}
        />
      </Box>

      {/* Children content wrapper */}
      <Box sx={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
  );
}
