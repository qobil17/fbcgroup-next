import { useRef } from "react";
import { Stack } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useQuery, gql } from "@apollo/client";
import "swiper/css";
import ServiceCard from "./ServiceCard";

const GET_ALIF_SERVICES = gql`
  query GetAlifServicesHome($input: ServicesInquiry!) {
    getServices(input: $input) {
      list {
        _id
        serviceCollection
        serviceTitle
        serviceType
        serviceArea
        serviceImages
        serviceViews
        createdAt
      }
    }
  }
`;

const AlifLightServices = () => {
  const t = useTranslations("home");
  const swiperRef = useRef<SwiperType | null>(null);

  const { data, loading } = useQuery(GET_ALIF_SERVICES, {
    variables: {
      input: {
        page: 1,
        limit: 8,
        search: { serviceCollection: "ALIF", serviceStatus: "ACTIVE" },
      },
    },
  });

  const services = data?.getServices?.list ?? [];

  if (loading) {
    return (
      <Stack className="alif-services">
        <Stack className="container">
          <div className="section-header">
            <div className="skeleton-line" style={{ width: "220px", height: "28px" }} />
          </div>
          <div className="section-skeleton-grid">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="service-card-skeleton">
                <div className="service-card-skeleton__img" />
                <div className="service-card-skeleton__body">
                  <div className="service-card-skeleton__line service-card-skeleton__line--sm" />
                  <div className="service-card-skeleton__line" />
                  <div className="service-card-skeleton__line service-card-skeleton__line--md" />
                </div>
              </div>
            ))}
          </div>
        </Stack>
      </Stack>
    );
  }

  if (services.length === 0) return null;

  return (
    <Stack className="alif-services">
      <Stack className="container">
        <div className="section-header">
          <h2 className="section-title">{t("alifServices")}</h2>
          <Link href="/service/alifcards" className="section-link">
            {t("viewAll")} <EastIcon />
          </Link>
        </div>

        <div className="section-body">
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1.25}
            breakpoints={{
              600: { slidesPerView: 2 },
              900: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
            onSwiper={(s) => {
              swiperRef.current = s;
            }}
          >
            {services.map((svc: any) => (
              <SwiperSlide key={svc._id}>
                <ServiceCard service={svc} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="section-nav">
          <button
            className="nav-btn"
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Oldingi"
          >
            <WestIcon />
          </button>
          <button
            className="nav-btn"
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Keyingi"
          >
            <EastIcon />
          </button>
        </div>
      </Stack>
    </Stack>
  );
};

export default AlifLightServices;
