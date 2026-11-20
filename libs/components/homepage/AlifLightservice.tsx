import { Box, Link, Stack } from "@mui/material";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import ServiceCard from "./ServiceCard";
import { useServices } from "../../hooks/useServices";

const AlifLightServices = () => {
  const { services: aliflightServices, loading } = useServices({ collection: "ALIF", limit: 8 });
  return (
    <Stack className="alif-services">
      <Stack className="container">
        <Stack className="alif-info-box">
          <Box className="alif-left">
            <Link href="/service/alifcards">
              <span style={{ cursor: "pointer" }}>ALIF</span>
            </Link>
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
            <Box className="empty-list">{loading ? "Yuklanmoqda..." : "Hozircha xizmatlar mavjud emas"}</Box>
          ) : (
            <Swiper
              className="alif-service-swiper"
              modules={[Navigation]}
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
              {aliflightServices.map((service) => (
                <SwiperSlide key={service._id} className="alif-service-slide">
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

export default AlifLightServices;
