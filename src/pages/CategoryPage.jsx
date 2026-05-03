import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAI } from "../services/api";
import AICard from "../components/AICard";
import { Box, Typography } from "@mui/material";

export default function CategoryPage() {
  const { name } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    getAI().then(setData);
  }, []);

  const filtered = data.filter(
    (ai) => ai.category.toLowerCase() === name.toLowerCase()
  );

  // SEO
  useEffect(() => {
    document.title = `${name} AI Tools - Best ${name} AI | AICentralStore`;

    const meta = document.querySelector("meta[name='description']");
    if (meta) {
      meta.setAttribute(
        "content",
        `Explore best ${name} AI tools. Discover top ${name} AI apps and platforms.`
      );
    }
  }, [name]);

  return (
    <Box sx={{ px: 3, py: 10 }}>
      <Typography variant="h4" mb={3}>
        {name} AI Tools
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {filtered.map((ai, i) => (
          <Box key={i} sx={{ width: 260 }}>
            <AICard ai={ai} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}