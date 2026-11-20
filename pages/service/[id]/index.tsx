import Link from "next/link";
import { useState, useEffect } from "react";
import { Stack } from "@mui/material";
import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import WestIcon from "@mui/icons-material/West";
import { useTranslations } from "next-intl";
import withLayoutBasic from "../../../libs/components/layout/LayoutBasic";
import { getImageUrl } from "../../../lib/uploadImage";
import useDeviceDetect from "../../../libs/hooks/useDeviceDetect";
import { useLocaleContext } from "../../../lib/LocaleContext";
import { serviceTitle, serviceDesc } from "../../../lib/localize";

const GET_SERVICE = gql`
  query GetServiceDetail($serviceId: String!) {
    getService(serviceId: $serviceId) {
      _id
      serviceCollection
      serviceTitle
      serviceTitleRu
      serviceTitleEn
      serviceType
      serviceStatus
      serviceDetail
      serviceArea
      servicePrice
      serviceDesc
      serviceDescRu
      serviceDescEn
      serviceImages
      serviceViews
      createdAt
    }
  }
`;

const ServiceDetailPage = () => {
  const device = useDeviceDetect();
  const router = useRouter();
  const t = useTranslations("service");
  const { locale } = useLocaleContext();
  const { id } = router.query;
  const [activeImg, setActiveImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightboxOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightboxOpen]);

  const { data, loading, error } = useQuery(GET_SERVICE, {
    variables: { serviceId: id as string },
    skip: !id,
  });

  const service = data?.getService;
  const title = service ? serviceTitle(service, locale) : "";
  const desc = service ? serviceDesc(service, locale) : "";

  if (loading && !data) {
    return (
      <Stack className="service-detail-page">
        <div className="container" style={{ paddingTop: 64, textAlign: "center" }}>
          {t("loading")}
        </div>
      </Stack>
    );
  }

  if (error || !service) {
    return (
      <Stack className="service-detail-page">
        <div className="container" style={{ paddingTop: 64, textAlign: "center" }}>
          <p>{t("notFound")}</p>
          <button className="nav-btn" onClick={() => router.back()} style={{ marginTop: 16 }}>
            <WestIcon /> {t("back")}
          </button>
        </div>
      </Stack>
    );
  }

  const images: string[] = service.serviceImages ?? [];
  const mainImage = getImageUrl(images[activeImg] ?? "");
  const date = new Date(service.createdAt);
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  return (
    <Stack className="service-detail-page">
      <div className="container">
        <div className="service-detail">
          {/* Image gallery */}
          <div className="service-detail__gallery">
            <div className="service-detail__main-img" onClick={() => mainImage && setLightboxOpen(true)}>
              {mainImage ? (
                <img src={mainImage} alt={title} />
              ) : (
                <img src="/img/service/house.webp" alt={title} />
              )}
            </div>
            {images.length > 1 && (
              <div className="service-detail__thumbs">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`service-detail__thumb${activeImg === i ? " active" : ""}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={getImageUrl(img)} alt={`${title} ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="service-detail__info">
            <span className="service-detail__collection">{service.serviceCollection}</span>
            <h1 className="service-detail__title">{title}</h1>

            <div className="service-detail__meta">
              <div className="service-detail__meta-row">
                <span className="service-detail__meta-label">{t("labelDetail")}:</span>
                <span className="service-detail__meta-value">{service.serviceDetail}</span>
              </div>
              <div className="service-detail__meta-row">
                <span className="service-detail__meta-label">{t("labelType")}:</span>
                <span className="service-detail__meta-value">
                  {service.serviceType === "DELIVERY" ? t("typeDelivery")
                    : service.serviceType === "INSTALLATION" ? t("typeInstallation")
                    : service.serviceType === "FULL_PROJECT" ? t("typeFullProject")
                    : service.serviceType}
                </span>
              </div>
              <div className="service-detail__meta-row">
                <span className="service-detail__meta-label">{t("labelArea")}:</span>
                <span className="service-detail__meta-value">
                  {service.serviceArea === "EXTERIOR" ? t("areaExterior")
                    : service.serviceArea === "INTERIOR" ? t("areaInterior")
                    : service.serviceArea}
                </span>
              </div>
              </div>

            {desc && (
              <p className="service-detail__desc">{desc}</p>
            )}

            <div className="service-detail__footer">
              <div className="service-detail__views">
                <RemoveRedEyeIcon fontSize="small" />
                <span>{service.serviceViews}</span>
              </div>
              <span className="service-detail__date">{dateStr}</span>
            </div>

            <Link href="/order" className="service-detail__order-btn">
              {t("orderBtn")}
            </Link>

            <button className="service-detail__back" onClick={() => router.back()}>
              <WestIcon fontSize="small" /> {t("back")}
            </button>
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <div className="lightbox" onClick={() => setLightboxOpen(false)}>
          <button className="lightbox__close" onClick={() => setLightboxOpen(false)}>✕</button>
          <img
            className="lightbox__img"
            src={mainImage}
            alt={title}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </Stack>
  );
};

export default withLayoutBasic(ServiceDetailPage);
