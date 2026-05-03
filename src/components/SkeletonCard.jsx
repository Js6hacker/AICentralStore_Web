import { Box, Skeleton } from "@mui/material";

export default function SkeletonCard() {
  return (
    <Box sx={{ width: 260 }}>
      <Skeleton variant="rounded" height={140} />
      <Skeleton sx={{ mt: 1 }} />
      <Skeleton width="60%" />
    </Box>
  );
}