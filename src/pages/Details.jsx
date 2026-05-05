import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Chip,
  Grid,
  IconButton,
  Skeleton
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getAI } from "../services/api";
import AICard from "../components/AICard";
import { Helmet } from "react-helmet-async";

export default function Details() {
  const { slug } = useParams();
  const navigate = useNavigate();

  //  3-state system
  const [ai, setAI] = useState(undefined);
  const [similar, setSimilar] = useState([]);

  //  Safe domain
  const getDomain = (url) => {
    try {
      return new URL(url).hostname;
    } catch {
      return "";
    }
  };

  //  Fetch AI
  useEffect(() => {
    setAI(undefined);

    getAI().then((data) => {
      const found = data.find(
        (a) =>
          a.name
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, "")
            .replace(/\s+/g, "-") === slug
      );

      setAI(found || false); // false = not found
    });
  }, [slug]);

  //  Redirect if not found
  useEffect(() => {
    if (ai === false) {
      navigate("/", { replace: true });
    }
  }, [ai, navigate]);
  

  //  Similar AI
  useEffect(() => {
    if (!ai || ai === false) return;

    getAI().then((data) => {
      const filtered = data
        .filter(
          (item) =>
            item.category === ai.category &&
            item.name !== ai.name
        )
        .slice(0, 4);

      setSimilar(filtered);
    });
  }, [ai]);

  //  Scroll
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  //  SEO
  useEffect(() => {
    if (!ai || ai === false) return;

  //   document.title = `${ai.name} - Best ${ai.category} AI | AICentralStore`;

  //   const meta = document.querySelector("meta[name='description']");
  //   if (meta) {
  //     meta.setAttribute("content", ai.description);
  //   }
   }, [ai]);
  

  //  LOADING
  if (ai === undefined) {
    return (
      <Box sx={{ p: 5 }}>
        <Skeleton width={200} height={50} />
        <Skeleton height={150} />
      </Box>
    );
  }

  
  if (ai === false) return null;

  return (
    <Container maxWidth="md" sx={{ pt: 10, pb: 5 }}>
    <Helmet>
      <title>
    {ai
      ? `${ai.name} - Best ${ai.category} AI Tool`
      : "AICentralStore - Discover AI Tools"}
  </title>
      <meta name="description" content={ai.enhanced_description || ai.description} />
      <meta property="og:title" content={ai.name} />
      <meta property="og:description" content={ai.description} />
      <meta property="og:type" content="website" />
    </Helmet>
      
      {/* BACK */}
      <IconButton
        onClick={() => {
          if (window.history.length > 2) {
            navigate(-1);
          } else {
            navigate("/", { replace: true });
          }
        }}
        sx={{
          position: "fixed",
          top: 80,
          left: 20,
          color: "#fff",
          background: "rgba(0,0,0,0.6)"
        }}
      >
        <ArrowBackIcon />
      </IconButton>
      

      {/* MAIN */}
      <Box
        sx={{
          p: 4,
          borderRadius: 4,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)"
        }}
      >
        <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
          
          {/* ICON */}
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: 3,
              background: "#1f2937",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {getDomain(ai.website) ? (
              <img
                src={`https://www.google.com/s2/favicons?sz=128&domain=${getDomain(ai.website)}`}
                style={{ width: "80%" }}
              />
            ) : (
              <Typography>{ai.name[0]}</Typography>
            )}
          </Box>

          {/* INFO */}
          <Box>
            <Typography variant="h4">{ai.name}</Typography>
            <Chip label={ai.category} sx={{ mt: 1 }} />
            <Typography sx={{ mt: 1 }} color="gray">
              {ai.website}
            </Typography>
          </Box>
        </Box>

        {/* DESCRIPTION */}
        <Typography mt={3}>{ai.description}</Typography>

        {/* BUTTON */}
        <Button
          variant="contained"
          href={ai.website}
          target="_blank"
          sx={{ mt: 3 }}
        >
          Open Website
        </Button>
      </Box>

      {/* SIMILAR */}
      {similar.length > 0 && (
        <Box mt={5}>
          <Typography variant="h5" mb={2} sx = {{mt:5, mb:3}}>
            Similar AI Tools
          </Typography>

          <Grid container spacing={2}>
            {similar.map((item, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <AICard ai={item} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
}