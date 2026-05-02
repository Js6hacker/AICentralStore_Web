import {
  Card, CardContent, Typography, Button, Box, Chip
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

export default function AICard({ ai }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const domain = (() => {
    try { return new URL(ai.website).hostname; }
    catch { return ""; }
  })();

  return (
    <motion.div whileHover={{ scale: 1.04 }}>
      <Card sx={{ p:2, borderRadius:4, height:"100%", display:"flex", flexDirection:"column", justifyContent:"space-between",
        background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)" }}>
        
        <Box sx={{ display:"flex", gap:2, alignItems:"center" }}>
          <Box sx={{ width:56, height:56, borderRadius:2, background:"#111", display:"flex", alignItems:"center", justifyContent:"center" }}>
            {!imgError && domain ? (
              <img
                src={`https://www.google.com/s2/favicons?sz=128&domain=${domain}`}
                onError={()=>setImgError(true)}
                style={{ width:"100%", height:"100%", objectFit:"cover" }}
              />
            ) : (
              <Typography>{ai.name?.charAt(0)}</Typography>
            )}
          </Box>

          <Box>
            <Typography fontWeight="bold" noWrap>{ai.name}</Typography>
            <Chip label={ai.category} size="small" />
          </Box>
        </Box>

        <CardContent sx={{ px:0 }}>
          <Typography variant="body2" color="gray">
            {ai.description?.slice(0,70)}...
          </Typography>
        </CardContent>

        <Box sx={{ display:"flex", gap:1 }}>
          <Button size="small" variant="contained"
            onClick={()=>navigate("/details",{state:ai})}>
            View
          </Button>

          <Button size="small" variant="outlined"
            href={ai.website} target="_blank">
            Open
          </Button>
        </Box>
      </Card>
    </motion.div>
  );
}