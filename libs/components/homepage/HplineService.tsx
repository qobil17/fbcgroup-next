import { Box, Link, Stack } from "@mui/material";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import ServiceCard from "./ServiceCard";
import { useServices } from "../../hooks/useServices";

const HplineServices = () => {
  const { services: hplineServices, loading } = useServices({ collection: "HPLINE", limit: 8 });
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
            <Box className="empty-list">{loading ? "Yuklanmoqda..." : "Hozircha xizmatlar mavjud emas"}</Box>
          ) : (
            <Swiper
              className="hpline-service-swiper"
              modules={[Navigation]}
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
              {hplineServices.map((service) => (
                <SwiperSlide key={service._id} className="hpline-service-slide">
                  <ServiceCard service={service} />
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
