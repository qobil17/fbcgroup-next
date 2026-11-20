import { useRouter } from "next/router";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { getImageUrl } from "../../../lib/uploadImage";
import { useLocaleContext } from "../../../lib/LocaleContext";
import { serviceTitle } from "../../../lib/localize";

export interface ServiceItem {
  _id?: string;
  serviceTitle: string;
  serviceTitleRu?: string | null;
  serviceTitleEn?: string | null;
  serviceImages: string[];
  serviceCollection: string;
  serviceViews: number;
  createdAt: string;
  badge?: "NEW" | "POPULAR";
}

interface Props {
  service?: ServiceItem;
}

const MOCK: ServiceItem = {
  serviceTitle: "No.1 Fasad Xizmati",
  serviceImages: ["/img/service/house.webp"],
  serviceCollection: "HPLINE",
  serviceViews: 128,
  createdAt: new Date().toISOString(),
};

const ServiceCard = ({ service = MOCK }: Props) => {
  const router = useRouter();
  const { locale } = useLocaleContext();
  const title = serviceTitle(service, locale);
  const rawImage = service.serviceImages?.[0] ?? "";
  const image = getImageUrl(rawImage) || "/img/service/house.webp";
  const d = new Date(service.createdAt);
  const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const handleClick = () => {
    if (service._id) {
      router.push(`/service/${service._id}`);
    }
  };

  return (
    <article
      className="service-card"
      onClick={handleClick}
      style={{ cursor: service._id ? "pointer" : "default" }}
    >
      <div className="service-card__image">
        <img src={image} alt={title} loading="lazy" />
        {service.badge && (
          <span
            className={`service-card__badge service-card__badge--${service.badge.toLowerCase()}`}
          >
            {service.badge}
          </span>
        )}
      </div>

      <div className="service-card__body">
        <span className="service-card__category">{service.serviceCollection}</span>
        <h3 className="service-card__title">{title}</h3>
        <div className="service-card__footer">
          <div className="service-card__views">
            <RemoveRedEyeIcon />
            <span>{service.serviceViews}</span>
          </div>
          <span className="service-card__date">{date}</span>
        </div>
      </div>
    </article>
  );
};

export default ServiceCard;
