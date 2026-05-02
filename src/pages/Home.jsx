import { useEffect, useState } from "react";
import { getAI } from "../services/api";
import AICard from "../components/AICard";
import AdBanner from "../components/AdBanner";
import { Container, TextField, Typography, Box } from "@mui/material";

export default function Home() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAI().then(setData);
  }, []);

  const categories = [...new Set(data.map(a => a.category))];

  const filtered = data.filter(ai =>
    ai.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ px: 3, py: 2 }}>
      
      {/* HERO */}
      {/* <Typography variant="h3" fontWeight="bold" mb={2}>
         AI Central Store
      </Typography> */}

      <TextField
        fullWidth
        placeholder="Search AI..."
        sx={{ mb: 3 }}
        onChange={(e) => setSearch(e.target.value)}
      />

      <AdBanner />

      {/* NETFLIX STYLE SECTIONS */}
      {categories.map((cat) => {
        const items = filtered.filter(a => a.category === cat);
        if (!items.length) return null;

        return (
          <Box key={cat} sx={{ mb: 5 }}>
            
            {/* CATEGORY TITLE */}
            <Typography
              variant="h5"
              fontWeight="bold"
              mb={2}
              sx={{ ml: 1 }}
            >
              {cat}
            </Typography>

            {/* HORIZONTAL SCROLL (NO SCROLLBAR) */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                overflowX: "auto",
                pb: 1,

                /* 🔥 Hide scrollbar */
                scrollbarWidth: "none", // Firefox
                "&::-webkit-scrollbar": { display: "none" } // Chrome
              }}
            >
              {items.map((ai, i) => (
                <Box key={i} sx={{ minWidth: 260 }}>
                  <AICard ai={ai} />
                </Box>
              ))}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}