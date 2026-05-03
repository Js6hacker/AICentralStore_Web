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

  return (
    <motion.div whileHover={{ scale: 1.04 }}>
      <Card
        sx={{
          p: 2,
          borderRadius: 4,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)"
        }}
      >
        {/* TOP */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          
          {/* ICON */}
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              background: "#1f2937",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden"
            }}
          >
            {!imgError && domain ? (
              <img
                src={`https://www.google.com/s2/favicons?sz=128&domain=${domain}`}
                alt={ai.name}
                onError={() => setImgError(true)}
                style={{
                  width: "80%",
                  height: "80%",
                  objectFit: "contain"
                }}
              />
            ) : (
              <Typography color="#ccc" fontWeight="bold">
                {ai.name?.charAt(0)}
              </Typography>
            )}
          </Box>

          {/* NAME */}
          <Box>
            <Typography fontWeight="bold" noWrap>
              {ai.name}
            </Typography>
            <Chip label={ai.category} size="small" />
          </Box>
        </Box>

        {/* DESCRIPTION */}
        <CardContent sx={{ px: 0 }}>
          <Typography variant="body2" color="gray">
            {ai.description?.slice(0, 70)}...
          </Typography>
        </CardContent>

        {/* ACTIONS */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button size="small" variant="contained" onClick={handleClick}>
            View
          </Button>

          <Button
            size="small"
            variant="outlined"
            href={ai.website}
            target="_blank"
          >
            Open
          </Button>
        </Box>
      </Card>
    </motion.div>
  );
}