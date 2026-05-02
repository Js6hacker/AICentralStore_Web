import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  Chip,
  Grid,
  IconButton
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import { getAI } from "../services/api";
import AICard from "../components/AICard";

export default function Details() {
  const { state: ai } = useLocation();
  const navigate = useNavigate();

  const [similar, setSimilar] = useState([]);
  const [imgError, setImgError] = useState(false);

  if (!ai) return <Typography>No Data</Typography>;

  // extract domain for logo
  const getDomain = (url) => {
    try {
      return new URL(url).hostname;
    } catch {
      return "";
    }
  };

  const domain = getDomain(ai.website);

  // fetch similar AI tools
  useEffect(() => {
    getAI().then((data) => {
      const filtered = data
        .filter(
          (item) =>
            item.category === ai.category && item.name !== ai.name
        )
        .slice(0, 6);

      setSimilar(filtered);
    });
  }, [ai]);

  return (
    <Container
  maxWidth="md"
  sx={{
    pt: 10,   // 👈 TOP SPACE FIX (important)
    pb: 4
  }}
>
      
      {/* 🔙 BACK BUTTON */}
      <IconButton
  onClick={() => navigate(-1)}
  sx={{
    position: "absolute",
    top: 80,      // 👈 below navbar
    left: 20,

    color: "#fff",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    backdropFilter: "blur(8px)",

    "&:hover": {
      background: "rgba(255,255,255,0.2)"
    }
  }}
>
  <ArrowBackIcon />
</IconButton>

      {/* MAIN CARD */}
      <Box
        sx={{
          p: 4,
          borderRadius: 4,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)"
        }}
      >
        {/* HEADER */}
        <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
          
          {/* ICON */}
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: 3,
              background: "#111",
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
                width="100%"
                height="100%"
                style={{ objectFit: "cover" }}
                onError={() => setImgError(true)}
              />
            ) : (
              <Typography fontSize="32px" fontWeight="bold">
                {ai.name?.charAt(0)}
              </Typography>
            )}
          </Box>

          {/* INFO */}
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {ai.name}
            </Typography>

            <Chip label={ai.category} sx={{ mt: 1 }} />

            <Typography sx={{ mt: 1 }} color="gray">
              {ai.website}
            </Typography>
          </Box>
        </Box>

        {/* DESCRIPTION */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" mb={1}>
            About
          </Typography>

          <Typography color="gray">
            {ai.description || "No description available"}
          </Typography>
        </Box>

        {/* ACTION BUTTON */}
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            href={ai.website}
            target="_blank"
            sx={{ borderRadius: 3, px: 4 }}
          >
            Open Website
          </Button>
        </Box>
      </Box>

      {/* 🔥 SIMILAR AI SECTION */}
      {similar.length > 0 && (
        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" mb={2} fontWeight="bold">
            Similar AI Tools
          </Typography>

          <Grid container spacing={2}>
            {similar.map((item, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <AICard ai={item} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
}