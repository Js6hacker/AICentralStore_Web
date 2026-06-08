import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import LaunchIcon from "@mui/icons-material/Launch";

export default function AICard({ ai }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  // 🔗 create SEO slug
  const slug = ai?.name
    ?.toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-");

  // 🌐 extract domain for logo
  const domain = (() => {
    try {
      return new URL(ai.website).hostname;
    } catch {
      return "";
    }
  })();

  // 📊 track views + navigate
  const handleClick = () => {
    try {
      const views = JSON.parse(localStorage.getItem("views") || "{}");
      views[ai.name] = (views[ai.name] || 0) + 1;
      localStorage.setItem("views", JSON.stringify(views));
    } catch {}

    navigate(`/ai/${slug}`, { state: ai });
  };

  // Get view count for the badge
  const viewCount = (() => {
    try {
      const views = JSON.parse(localStorage.getItem("views") || "{}");
      return views[ai.name] || 0;
    } catch {
      return 0;
    }
  })();

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ height: "100%" }}
    >
      <Card
        sx={{
          p: 2.5,
          borderRadius: 4,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "rgba(255, 255, 255, 0.015)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          overflow: "visible", // To allow elements to slightly float if needed
          "&:hover": {
            borderColor: "rgba(99, 102, 241, 0.4)",
            boxShadow: "0 12px 30px rgba(99, 102, 241, 0.08)",
            background: "rgba(255, 255, 255, 0.025)"
          }
        }}
      >
        {/* TOP */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", position: "relative" }}>
          
          {/* ICON */}
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              background: "linear-gradient(135deg, rgba(31, 41, 55, 0.6) 0%, rgba(17, 24, 39, 0.8) 100%)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)"
            }}
          >
            {!imgError && domain ? (
              <img
                src={`https://www.google.com/s2/favicons?sz=128&domain=${domain}`}
                alt={ai.name}
                onError={() => setImgError(true)}
                style={{
                  width: "60%",
                  height: "60%",
                  objectFit: "contain"
                }}
              />
            ) : (
              <Typography color="primary.light" fontWeight="800" variant="h5" sx={{ fontFamily: "Outfit, sans-serif" }}>
                {ai.name?.charAt(0)}
              </Typography>
            )}
          </Box>

          {/* NAME */}
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography fontWeight="800" sx={{ fontFamily: "Outfit, sans-serif", fontSize: "1.05rem" }} noWrap>
              {ai.name}
            </Typography>
            <Chip
              label={ai.category}
              size="small"
              sx={{
                height: 20,
                fontSize: "11px",
                fontWeight: 600,
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                color: "text.secondary",
                mt: 0.5
              }}
            />
          </Box>

          {/* Popularity Badge */}
          {viewCount > 0 && (
            <Box
              sx={{
                position: "absolute",
                top: -8,
                right: -8,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
                borderRadius: "20px",
                px: 1,
                py: 0.2,
                boxShadow: "0 2px 8px rgba(239, 68, 68, 0.4)"
              }}
            >
              <WhatshotIcon sx={{ fontSize: "12px", color: "white" }} />
              <Typography fontSize="10px" fontWeight="bold" color="white">
                {viewCount}
              </Typography>
            </Box>
          )}
        </Box>

        {/* DESCRIPTION */}
        <CardContent sx={{ px: 0, py: 2, flexGrow: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {ai.description?.slice(0, 80) || "Explore this powerful AI tool."}
            {ai.description?.length > 80 ? "..." : ""}
          </Typography>
        </CardContent>

        {/* ACTIONS */}
        <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
          <Button
            size="small"
            variant="contained"
            onClick={handleClick}
            sx={{
              flex: 1,
              fontFamily: "Outfit, sans-serif",
              fontWeight: 700,
              fontSize: "12px",
              py: 0.8,
              borderRadius: "8px",
              background: "linear-gradient(90deg, #6366f1 0%, #4f46e5 100%)",
              "&:hover": {
                background: "linear-gradient(90deg, #4f46e5 0%, #4338ca 100%)"
              }
            }}
          >
            View
          </Button>

          <Button
            size="small"
            variant="outlined"
            href={ai.website}
            target="_blank"
            endIcon={<LaunchIcon sx={{ fontSize: "12px !important" }} />}
            sx={{
              flex: 1,
              fontFamily: "Outfit, sans-serif",
              fontWeight: 600,
              fontSize: "12px",
              py: 0.8,
              borderRadius: "8px",
              borderColor: "rgba(255,255,255,0.08)",
              color: "text.primary",
              background: "rgba(255,255,255,0.01)",
              "&:hover": {
                borderColor: "rgba(255,255,255,0.25)",
                background: "rgba(255,255,255,0.05)"
              }
            }}
          >
            Open
          </Button>
        </Box>
      </Card>
    </motion.div>
  );
}