import { Box, Stack } from "@mui/material";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import TelegramIcon from "@mui/icons-material/Telegram";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

const Footer = () => {
  return (
    <Stack className={"footer-container"}>
      <Stack className={"main"}>
        <Stack className={"left"}>
          <Box component={"div"} className={"footer-box"}>
            <img src="/img/logo/hpline-logo.svg" alt="HPLine" className={"logo"} />
          </Box>
          <Box component={"div"} className={"footer-box"}>
            <span>Tez sifatli xizmat</span>
            <p>+998001234567</p>
          </Box>
          <Box component={"div"} className={"footer-box"}>
            <span>Mutaxasis</span>
            <p>+998001234567</p>
            <span>yordami</span>
          </Box>
          <Box component={"div"} className={"footer-box"}>
            <p>Bizni ijtimoiy tarmoqlarda kuzatib boring</p>
            <div className={"media-box"}>
              <FacebookOutlinedIcon />
              <TelegramIcon />
              <InstagramIcon />
              <TwitterIcon />
            </div>
          </Box>
        </Stack>
        <Stack className={"right"}>
          <Box component={"div"} className={"top"}>
            <strong>keep yourself up to date</strong>
            <div>
              <input type="text" placeholder={"Your Email"} />
              <span>Subscribe</span>
            </div>
          </Box>
          <Box component={"div"} className={"bottom"}>
            <div>
              <strong>Popular Search</strong>
              <span>Fasad o'rnatish</span>
              <span>Yoritish tizimi o'rnatish</span>
            </div>
            <div>
              <strong>Quick Links</strong>
              <span>Terms of Use</span>
              <span>Privacy Policy</span>
              <span>Pricing Plans</span>
              <span>Our Services</span>
              <span>Contact Support</span>
              <span>FAQs</span>
            </div>
            <div>
              <strong>Discover</strong>
              <span>Toshkent</span>
              <span>Farg'ona</span>
              <span>Samarqand</span>
              <span>Nukus</span>
            </div>
          </Box>
        </Stack>
      </Stack>
      <Stack className={"second"}>
        <span>© FBC Group - All rights reserved. FBC Group </span>
        <span>Privacy · Terms · Sitemap</span>
      </Stack>
    </Stack>
  );
};

export default Footer;
