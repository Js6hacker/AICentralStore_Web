import { useEffect, useState } from "react";
import { getAI } from "../services/api";
import AICard from "../components/AICard";
import SkeletonCard from "../components/SkeletonCard";
import {
  Box,
  Typography,
  IconButton
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

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

      {/* 🔥 IMPROVED SEARCH BAR */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          alignItems: "center",
          background: "rgba(255,255,255,0.06)",
          borderRadius: 3,
          px: 2,
          height: 55,
          border: "1px solid rgba(255,255,255,0.15)",
          transition: "0.3s",
          "&:hover": {
            borderColor: "#6366f1",
          },
          "&:focus-within": {
            borderColor: "#6366f1",
            boxShadow: "0 0 10px rgba(99,102,241,0.5)"
          }
        }}
      >
        <SearchIcon sx={{ color: "#aaa", mr: 1 }} />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search AI tools..."
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: "white",
            width: "100%",
            fontSize: "16px"
          }}
        />

        {search && (
          <IconButton onClick={() => setSearch("")}>
            <ClearIcon sx={{ color: "#aaa" }} />
          </IconButton>
        )}
      </Box>

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

      {/* CATEGORIES */}
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