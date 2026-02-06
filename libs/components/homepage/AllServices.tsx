import { Box, Stack } from "@mui/material";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
import { Swiper, SwiperSlide } from "swiper/react";
import { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import ServiceCard from "./ServiceCard";

const AllServices = () => {
  const [allServices] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);

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
            <Box className="empty-list">Xizmat mavjud emas</Box>
          ) : (
            <Swiper
              className="all-service-swiper"
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
              {allServices.map((_, index) => (
                <SwiperSlide key={index} className="all-service-slide">
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

export default AllServices;

// import { Box, Stack } from "@mui/material";
// import WestIcon from "@mui/icons-material/West";
// import EastIcon from "@mui/icons-material/East";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { useState } from "react";
// import ServiceCard from "./ServiceCard";

// const AllServices = () => {
//   const [allServices, setAllServices] = useState<number[]>([1, 2, 3, 4]);

//   return (
//     <Stack className="all-services">
//       <Stack className="container">
//         <Stack className="info-box">
//           <Box className={"left"}>
//             <span>All Service</span>
//           </Box>
//           <Box className={"right"}>
//             <div className={"pagination-box"}>
//               <WestIcon className={"swiper-all-prev"} />
//               <div className={"swiper-all-pagination"}></div>
//               <EastIcon className={"swiper-all-next"} />
//             </div>
//           </Box>
//         </Stack>
//         <Stack className={"card-box"}>
//           {allServices.length === 0 ? (
//             <Box component={"div"} className={"empty-list"}>
//               Services Empty
//             </Box>
//           ) : (
//             <Stack className="all-service-swiper">
//               {" "}
//               {allServices.map((allServices, index) => {
//                 return <ServiceCard />;
//               })}
//             </Stack>
//           )}
//         </Stack>
//       </Stack>
//     </Stack>
//   );
// };

// export default AllServices;
//  <Stack className="all-service-swiper">
//               {" "}
//               {allServices.map((allServices, index) => {
//                 return <ServiceCard />;
//               })}
//             </Stack>

// <Swiper
//               className={"all-service-swiper"}
//               slidesPerView={"auto"}
//               spaceBetween={1}
//               navigation={{
//                 nextEl: ".swiper-all-next",
//                 prevEl: ".swiper-all-prev",
//               }}
//               pagination={{
//                 el: ".swiper-all-pagination",
//               }}
//             >
//               {allServices.map((allServices, index) => {
//                 return (
//                   <SwiperSlide className={"all-service-slide"}>
//                     <ServiceCard />
//                   </SwiperSlide>
//                 );
//               })}
//             </Swiper>
