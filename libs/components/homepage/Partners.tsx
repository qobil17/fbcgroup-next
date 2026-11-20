import { useQuery } from "@apollo/client";
import { useTranslations } from "next-intl";
import { GET_PARTNERS, Partner } from "../../../lib/projects";
import { getImageUrl } from "../../../lib/uploadImage";

// Hamkorlar logotiplari. Admin hamkor qo'shmaguncha bo'lim ko'rinmaydi.
const Partners = () => {
  const t = useTranslations("partners");
  const { data } = useQuery(GET_PARTNERS);
  const partners: Partner[] = data?.getPartners ?? [];
  if (partners.length === 0) return null;

  return (
    <section className="home-block home-block--partners" id="partners">
      <div className="home-block__inner">
        <div className="home-block__head home-block__head--center">
          <div>
            <span className="home-block__eyebrow">FBC Group</span>
            <h2 className="home-block__title">{t("title")}</h2>
            <p className="home-block__sub">{t("subtitle")}</p>
          </div>
        </div>
        <div className="partners-grid">
          {partners.map((p) => {
            const inner = (
              <>
                <img src={getImageUrl(p.partnerLogo)} alt={p.partnerName} loading="lazy" />
                <span className="partner-tile__name">{p.partnerName}</span>
              </>
            );
            return p.partnerLink ? (
              <a key={p._id} className="partner-tile" href={p.partnerLink} target="_blank" rel="noopener noreferrer" title={p.partnerDesc ?? p.partnerName}>
                {inner}
              </a>
            ) : (
              <div key={p._id} className="partner-tile" title={p.partnerDesc ?? p.partnerName}>
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Partners;
