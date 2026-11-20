import { Box, Stack, Typography, IconButton, Divider } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ShareIcon from "@mui/icons-material/Share";
import Link from "next/link";
import moment from "moment";
import { Service, label } from "../../types";
import { imageUrl } from "../../config";

interface Props {
  service: Service;
}

const ServiceCard = ({ service }: Props) => {
  const href = `/service/detail?id=${service._id}`;

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}${href}`;
    try {
      if (navigator.share) await navigator.share({ title: service.serviceTitle, url });
      else await navigator.clipboard.writeText(url);
    } catch {}
  };

  return (
    <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
      <Stack className="service-card-box">
        <Box className="card-img">
          <img src={imageUrl(service.serviceImages?.[0])} alt={service.serviceTitle} />
        </Box>

        <div className="status" onClick={handleShare} title="Ulashish">
          <ShareIcon sx={{ color: "#fff", fontSize: 18 }} />
        </div>

        <Box className="card-info">
          <strong className="title">{service.serviceTitle}</strong>

          <Divider sx={{ mt: 1.5, mb: 2 }} />

          <div className="bott">
            <div className="service-type">{label(service.serviceCollection)}</div>

            <div className="view-like-box">
              <IconButton size="small" tabIndex={-1}>
                <RemoveRedEyeIcon fontSize="small" />
              </IconButton>
              <Typography className="view-cnt">{service.serviceViews ?? 0}</Typography>
            </div>

            <div className="date">{moment(service.createdAt).format("DD.MM.YYYY")}</div>
          </div>
        </Box>
      </Stack>
    </Link>
  );
};
export default ServiceCard;
