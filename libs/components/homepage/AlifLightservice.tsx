import { Box, Stack } from "@mui/material";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
import { Swiper, SwiperSlide } from "swiper/react";
import ServiceCard from "./ServiceCard";
import { useState } from "react";

const AlifLightServices = () => {
  const [aliflightServices] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);
  return (
    <Stack className="alif-services">
      <Stack className="container">
        <Stack className="alif-info-box">
          <Box className="alif-left">
            <span>ALIF</span>
          </Box>
          <Box className="alif-right">
            <div className="alif-pagination-box">
              <WestIcon className="swiper-alif-prev" />
              <EastIcon className="swiper-alif-next" />
            </div>
          </Box>
        </Stack>
        <Stack className="alif-card-box">
          {aliflightServices.length === 0 ? (
            <Box className="empty-list">Services Empty</Box>
          ) : (
            <Swiper
              className="alif-service-swiper"
              spaceBetween={20}
              slidesPerView={4}
              navigation={{
                nextEl: ".swiper-alif-next",
                prevEl: ".swiper-alif-prev",
              }}
              breakpoints={{
                0: { slidesPerView: 1 },
                600: { slidesPerView: 2 },
                900: { slidesPerView: 3 },
                1200: { slidesPerView: 4 },
              }}
              pagination={{
                el: ".swiper-alif-pagination",
              }}
            >
              {aliflightServices.map((_, index) => (
                <SwiperSlide className="alif-service-slide">
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

export default AlifLightServices;
