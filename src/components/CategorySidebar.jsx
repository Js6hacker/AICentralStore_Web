import { Box, List, ListItemButton } from "@mui/material";

export default function CategorySidebar({ categories, selected, setSelected }) {
  return (
    <Box sx={{ width:200, borderRight:"1px solid #333", p:2 }}>
      <List>
        <ListItemButton selected={!selected} onClick={()=>setSelected("")}>
          All
        </ListItemButton>

        {categories.map((c,i)=>(
          <ListItemButton key={i} selected={selected===c} onClick={()=>setSelected(c)}>
            {c}
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}