import { useEffect, useState } from "react";
import { getAI } from "../services/api";
import AICard from "../components/AICard";
import SkeletonCard from "../components/SkeletonCard";
import { Box, Typography, TextField } from "@mui/material";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAI()
      .then((res) => {
        setData(res || []);
      })
      .catch(() => {
        setData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const categories = [...new Set(data.map((a) => a.category))];

  return (
    <Box sx={{ px: 3, pb: 5 }}>
      
      {/* HERO */}
      <Box
        sx={{
          height: 250,
          borderRadius: 4,
          mb: 3,
          mt: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: 4,
          background: "linear-gradient(135deg, #6366f1, #0f172a)",
        }}
      >
        <Typography variant="h3" fontWeight="bold">
          Discover AI Tools 🚀
        </Typography>
        <Typography color="gray">
          Explore the best AI tools in one place
        </Typography>
      </Box>

      {/* SEARCH */}
      <TextField
        fullWidth
        placeholder="Search AI..."
        sx={{ mb: 3 }}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* LOADING */}
      {loading && (
        <Box sx={{ display: "flex", gap: 2 }}>
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </Box>
      )}

      {/* EMPTY */}
      {!loading && data.length === 0 && (
        <Typography color="gray">
          No AI tools found
        </Typography>
      )}

      {/* 🔥 NETFLIX CATEGORY ROWS */}
      {!loading &&
        categories.map((cat) => {
          const items = data.filter(
            (a) =>
              a.category === cat &&
              a.name.toLowerCase().includes(search.toLowerCase())
          );

          if (!items.length) return null;

          return (
            <Box key={cat} sx={{ mb: 5 }}>
              
              <Typography variant="h5" fontWeight="bold" mb={2}>
                {cat}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  overflowX: "auto",
                  overflowY: "hidden",
                  scrollBehavior: "smooth",
                  "&::-webkit-scrollbar": { display: "none" }
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