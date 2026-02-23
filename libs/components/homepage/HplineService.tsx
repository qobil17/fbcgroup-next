import { Box, Link, Stack } from "@mui/material";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
import { Swiper, SwiperSlide } from "swiper/react";
import ServiceCard from "./ServiceCard";
import { useState } from "react";

const HplineServices = () => {
  const [hplineServices] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);
  return (
    <Stack className="hpline-services">
      <Stack className="container">
        <Stack className="hpline-info-box">
          <Box className="hpline-left">
            <Link href="/service/hplinecards">
              <span style={{ cursor: "pointer" }}>HPLINE</span>
            </Link>
          </Box>
          <Box className="hpline-right">
            <div className="hpline-pagination-box">
              <WestIcon className="swiper-hpline-prev" />
              <EastIcon className="swiper-hpline-next" />
            </div>
          </Box>
        </Stack>
        <Stack className="hpline-card-box">
          {hplineServices.length === 0 ? (
            <Box className="empty-list">Xizmatlar mavjud emas</Box>
          ) : (
            <Swiper
              className="hpline-service-swiper"
              spaceBetween={20}
              slidesPerView={4}
              navigation={{
                nextEl: ".swiper-hpline-next",
                prevEl: ".swiper-hpline-prev",
              }}
              breakpoints={{
                0: { slidesPerView: 1 },
                600: { slidesPerView: 2 },
                900: { slidesPerView: 3 },
                1200: { slidesPerView: 4 },
              }}
              pagination={{
                el: ".swiper-hpline-pagination",
              }}
            >
              {hplineServices.map((_, index) => (
                <SwiperSlide className="hpline-service-slide">
                  <ServiceCard />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default HplineServices;
