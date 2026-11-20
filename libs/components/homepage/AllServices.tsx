import { Box, Stack } from "@mui/material";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import ServiceCard from "./ServiceCard";
import { useServices } from "../../hooks/useServices";

const AllServices = () => {
  const { services: allServices, loading } = useServices({ collection: undefined, limit: 8 });

  return (
    <Stack className="all-services">
      <Stack className="container">
        {/* ===== TOP ===== */}
        <Stack className="info-box">
          <Box className="left">
            <span>Barcha xizmatlar</span>
          </Box>

          <Box className="right">
            <div className="pagination-box">
              <WestIcon className="swiper-all-prev" />
              <EastIcon className="swiper-all-next" />
            </div>
          </Box>
        </Stack>

        {/* ===== CARDS ===== */}
        <Stack className="card-box">
          {allServices.length === 0 ? (
            <Box className="empty-list">{loading ? "Yuklanmoqda..." : "Hozircha xizmatlar mavjud emas"}</Box>
          ) : (
            <Swiper
              className="all-service-swiper"
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={4}
              navigation={{
                nextEl: ".swiper-all-next",
                prevEl: ".swiper-all-prev",
              }}
              breakpoints={{
                0: { slidesPerView: 1 },
                600: { slidesPerView: 2 },
                900: { slidesPerView: 3 },
                1200: { slidesPerView: 4 },
              }}
              pagination={{
                el: ".swiper-all-pagination",
              }}
            >
              {allServices.map((service) => (
                <SwiperSlide key={service._id} className="all-service-slide">
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

export default AllServices;
