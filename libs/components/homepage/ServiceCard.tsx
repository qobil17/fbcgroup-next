import { Box, Stack, Typography, IconButton, Divider } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"; // Ko'rishlar uchun
import ShareIcon from "@mui/icons-material/Share"; // Ulashish uchun

const ServiceCard = () => {
  return (
    <Stack className="service-card-box">
      <Box className="card-img">
        <img src="/img/service/house.webp" alt="service" />
      </Box>

      <div className="status">
        <ShareIcon sx={{ color: "#fff", fontSize: 18 }} />
      </div>

      <Box className="card-info">
        <strong className="title">No.1 FASAD XIZMATI</strong>

        <Divider sx={{ mt: 1.5, mb: 2 }} />

        <div className="bott">
          <div className="service-type">HPLINE</div>

          <div className="view-like-box">
            <IconButton size="small">
              <RemoveRedEyeIcon fontSize="small" />
            </IconButton>
            <Typography className="view-cnt">100</Typography>
          </div>

          <div className="date">17.09.1996</div>
        </div>
      </Box>
    </Stack>
  );
};
export default ServiceCard;
