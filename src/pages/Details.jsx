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
import { Helmet } from "react-helmet-async";

import { getAI } from "../services/api";
import AICard from "../components/AICard";

export default function Details() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [ai, setAI] = useState(undefined);
  const [similar, setSimilar] = useState([]);

  // SAFE DOMAIN
  const getDomain = (url) => {
    try {
      return new URL(url).hostname;
    } catch {
      return "";
    }
  };

  // FETCH AI
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

      setAI(found || false);
    });
  }, [slug]);

  // REDIRECT IF NOT FOUND
  useEffect(() => {
    if (ai === false) {
      navigate("/", { replace: true });
    }
  }, [ai, navigate]);

  // SIMILAR TOOLS
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

  // SCROLL TOP
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // LOADING
  if (ai === undefined) {
    return (
      <Box sx={{ p: 5 }}>
        <Skeleton width={200} height={50} />
        <Skeleton height={200} sx={{ mt: 2 }} />
      </Box>
    );
  }

  if (ai === false) return null;

  return (
    <>
      <Helmet>
        <title>
          {ai.name} - Best {ai.category} AI Tool (2026)
        </title>

        <meta
          name="description"
          content={`${ai.name} is a powerful ${ai.category} AI tool for productivity, automation, and workflow improvement.`}
        />

        <meta property="og:title" content={ai.name} />

        <meta
          property="og:description"
          content={ai.description}
        />

        <meta
          property="og:image"
          content={`https://image.pollinations.ai/prompt/${ai.name} AI tool`}
        />
      </Helmet>

      <Container
        maxWidth="xl"
        sx={{
          pt: 11,
          pb: 7,
          maxWidth: "1400px"
        }}
      >
        {/* BACK BUTTON */}
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
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,

            "&:hover": {
              background: "rgba(255,255,255,0.1)"
            }
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        {/* PAGE TITLE */}
        <Box mb={4}>
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{
              fontSize: {
                xs: "2.5rem",
                md: "4rem",
              },
              mt: 2
            }}
          >
            {ai.name}
          </Typography>

          <Typography
            color="#9ca3af"
            mt={1}
            sx={{
              fontSize: "1.1rem",
              mb: 2
            }}
          >
            Best {ai.category} AI Tool for Productivity
            (2026)
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* LEFT CONTENT */}
          <Grid item xs={12} md={8}>
            {/* HERO CARD */}
            <Box
              sx={{
                p: {
                  xs: 3,
                  md: 5
                },
                borderRadius: 5,
                background:
                  "linear-gradient(180deg,#111827,#081028)",
                border:
                  "1px solid rgba(255,255,255,0.08)",
                boxShadow:
                  "0 10px 40px rgba(0,0,0,0.4)"
              }}
            >
              {/* TOP */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    md: "row"
                  },
                  gap: 3,
                  alignItems: {
                    xs: "flex-start",
                    md: "center"
                  }
                }}
              >
                {/* LOGO */}
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: 4,
                    background:
                      "rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    border:
                      "1px solid rgba(255,255,255,0.08)"
                  }}
                >
                  {getDomain(ai.website) ? (
                    <img
                      src={`https://www.google.com/s2/favicons?sz=128&domain=${getDomain(
                        ai.website
                      )}`}
                      alt={ai.name}
                      style={{
                        width: "75%",
                        objectFit: "contain"
                      }}
                    />
                  ) : (
                    <Typography variant="h3">
                      {ai.name[0]}
                    </Typography>
                  )}
                </Box>

                {/* INFO */}
                <Box flex={1}>
                  <Chip
                    label={ai.category}
                    sx={{
                      mb: 2,
                      background: "#4f46e5",
                      color: "#fff",
                      fontWeight: 600
                    }}
                  />

                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    sx={{
                      fontSize: {
                        xs: "2.2rem",
                        md: "3.5rem"
                      }
                    }}
                  >
                    {ai.name}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 2,
                      color: "#9ca3af",
                      lineHeight: 1.9,
                      maxWidth: 700,
                      fontSize: "1.05rem"
                    }}
                  >
                    {ai.description}

                    <br />
                    <br />

                    {ai.name} is an advanced AI platform
                    designed to help users improve
                    productivity, automate workflows,
                    and simplify complex tasks using AI.
                  </Typography>

                  {/* ACTIONS */}
                  <Box
                    sx={{
                      mt: 4,
                      display: "flex",
                      gap: 2,
                      flexWrap: "wrap"
                    }}
                  >
                    <Button
                      variant="contained"
                      href={ai.website}
                      target="_blank"
                      sx={{
                        px: 4,
                        py: 1.3,
                        borderRadius: 3,
                        textTransform: "none",
                        fontWeight: "bold",
                        background: "#6366f1",

                        "&:hover": {
                          background: "#4f46e5"
                        }
                      }}
                    >
                      Visit Website
                    </Button>

                    <Button
                      variant="outlined"
                      sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1.3,
                        textTransform: "none",
                        borderColor: "#4f46e5",
                        color: "#6366f1"
                      }}
                    >
                      Learn More
                    </Button>
                  </Box>
                </Box>
              </Box>

              {/* STATS */}
              <Grid container spacing={3} sx={{ mt: 4, mb: 3 }}>
                {[
                  {
                    title: "Category:",
                    value: ai.category
                  },
                  {
                    title: "Pricing:",
                    value: "Free & Paid"
                  },
                  {
                    title: "Platform",
                    value: "Web Based"
                  }
                ].map((item) => (
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    key={item.title}
                  >
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 4,
                        background:
                          "rgba(255,255,255,0.04)",
                        border:
                          "1px solid rgba(255,255,255,0.06)"
                      }}
                    >
                      <Typography
                        color="#9ca3af"
                        mb={1}
                      >
                        {item.title}
                      </Typography>

                      <Typography fontWeight="bold">
                        {item.value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* ABOUT */}
              <Box mt={4}>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  mb={2}
                  sx={{mt: 4, mb: 2}}
                >
                  About {ai.name}
                </Typography>

                <Typography
                  sx={{
                    color: "#cbd5e1",
                    lineHeight: 2
                  }}
                >
                  {ai.name} is one of the leading
                  tools in the {ai.category} space.
                  It helps users save time, increase
                  efficiency, and streamline
                  workflows using modern AI
                  technology.
                </Typography>
              </Box>

              {/* FEATURES */}
              <Box mt={4}>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  mb={3}
                  sx={{mt: 3, mb: 2}}
                >
                  Key Features
                </Typography>

                <Grid container spacing={2}>
                  {[
                    "AI Automation",
                    "Fast Performance",
                    "Easy To Use",
                    "Cloud Based",
                    "Productivity Focused",
                    "Beginner Friendly"
                  ].map((feature) => (
                    <Grid
                      item
                      xs={6}
                      md={4}
                      key={feature}
                    >
                      <Box
                        sx={{
                          p: 2.5,
                          borderRadius: 3,
                          background:
                            "rgba(255,255,255,0.03)",
                          border:
                            "1px solid rgba(255,255,255,0.05)",
                          textAlign: "center"
                        }}
                      >
                        {feature}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* FAQ */}
              <Box mt={4}>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  mb={3}
                  sx={{mt: 3, mb: 2}}
                >
                  FAQs
                </Typography>

                <Box mb={3}>
                  <Typography fontWeight="bold">
                    What is {ai.name} used for?
                  </Typography>

                  <Typography
                    color="#9ca3af"
                    mt={1}
                  >
                    {ai.name} is used for{" "}
                    {ai.category.toLowerCase()}{" "}
                    tasks, automation, and improving
                    productivity.
                  </Typography>
                </Box>

                <Box>
                  <Typography fontWeight="bold" sx={{mt: 2}}>
                    Is {ai.name} free?
                  </Typography>

                  <Typography
                    color="#9ca3af"
                    mt={1}
                  >
                    It provides both free and
                    premium plans depending on
                    features and usage.
                  </Typography>
                </Box>
              </Box>

              {/* INTERNAL LINKS */}
              <Box mt={4}>
                <Typography color="#cbd5e1" sx={{mt:4}}>
                  Explore similar tools like{" "}
                  <span
                    style={{
                      color: "#6366f1",
                      cursor: "pointer"
                    }}
                    onClick={() =>
                      navigate("/ai/chatgpt")
                    }
                  >
                    ChatGPT
                  </span>
                  ,{" "}
                  <span
                    style={{
                      color: "#6366f1",
                      cursor: "pointer"
                    }}
                    onClick={() =>
                      navigate("/ai/gemini")
                    }
                  >
                    Gemini
                  </span>
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* RIGHT SIDEBAR */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                position: "sticky",
                top: 100
              }}
            >
              <Box
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background:
                    "rgba(255,255,255,0.04)",
                  border:
                    "1px solid rgba(255,255,255,0.06)",
                  backdropFilter: "blur(10px)"
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  mb={2}
                  sx={{mb: 2}}
                >
                  Overview
                </Typography>

                <Box mb={2}>
                  <Typography color="#888">
                    Category:
                  </Typography>

                  <Typography fontWeight="bold">
                    {ai.category}
                  </Typography>
                </Box>

                <Box mb={3} sx={{mt: 1}}>
                  <Typography color="#888">
                    Pricing:
                  </Typography>

                  <Typography fontWeight="bold">
                    Free & Paid
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  href={ai.website}
                  target="_blank"
                  sx={{
                    borderRadius: 3,
                    py: 1.2,
                    textTransform: "none",
                    fontWeight: "bold",
                    mt: 2  
                  }}
                >
                  Visit Website
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* SIMILAR TOOLS */}
        {similar.length > 0 && (
          <Box
            mt={8}
            pt={5}
            sx={{
              borderTop:
                "1px solid rgba(255,255,255,0.06)",
              mt: 4
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              mb={3}
              sx={{mb: 3}}
            >
              Similar AI Tools
            </Typography>

            <Grid container spacing={3}>
              {similar.map((item, i) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  key={i}
                >
                  <AICard ai={item} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </>
  );
}