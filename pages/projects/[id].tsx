import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { useTranslations } from "next-intl";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
import CloseIcon from "@mui/icons-material/Close";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import { GET_PROJECT, Project, formatProjectDate } from "../../lib/projects";
import { getImageUrl } from "../../lib/uploadImage";
import { useLocaleContext } from "../../lib/LocaleContext";

const ProjectDetail = () => {
  const t = useTranslations("projects");
  const { locale } = useLocaleContext();
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";

  const { data, loading, error } = useQuery(GET_PROJECT, { variables: { projectId: id }, skip: !id });
  const project: Project | undefined = data?.getProject;

  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const images = project?.projectImages ?? [];

  const step = (d: number) => setActive((i) => (i + d + images.length) % images.length);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightbox, images.length]);

  if (!id || (loading && !data)) return <div className="project-detail project-detail--state">{t("loading")}</div>;
  if (error || !project) {
    return (
      <div className="project-detail project-detail--state">
        <p>{t("notFound")}</p>
        <Link href="/projects" className="project-detail__back">
          <WestIcon fontSize="small" /> {t("back")}
        </Link>
      </div>
    );
  }

  const paragraphs = project.projectDesc.split(/\n{2,}|\r\n\r\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <div className="project-detail">
      <div className="project-detail__inner">
        <Link href="/projects" className="project-detail__back">
          <WestIcon fontSize="small" /> {t("back")}
        </Link>

        <h1 className="project-detail__title">{project.projectTitle}</h1>

        <div className="project-detail__meta">
          {project.projectCollection && (
            <div>
              <span>{t("direction")}</span>
              <b>{project.projectCollection === "ALIF" ? "ALIF LIGHT" : "HPLINE"}</b>
            </div>
          )}
          {project.projectLocation && (
            <div>
              <span>{t("location")}</span>
              <b>{project.projectLocation}</b>
            </div>
          )}
          <div>
            <span>{t("date")}</span>
            <b>{formatProjectDate(project.projectDate ?? project.createdAt, locale)}</b>
          </div>
          <div>
            <span>{t("photos")}</span>
            <b>{images.length}</b>
          </div>
        </div>

        {images.length > 0 && (
          <div className="project-gallery">
            <button className="project-gallery__main" onClick={() => setLightbox(true)}>
              <img src={getImageUrl(images[active])} alt={project.projectTitle} />
              {images.length > 1 && (
                <>
                  <span className="project-gallery__nav project-gallery__nav--prev" onClick={(e) => { e.stopPropagation(); step(-1); }}>
                    <WestIcon fontSize="small" />
                  </span>
                  <span className="project-gallery__nav project-gallery__nav--next" onClick={(e) => { e.stopPropagation(); step(1); }}>
                    <EastIcon fontSize="small" />
                  </span>
                  <span className="project-gallery__counter">
                    {active + 1} / {images.length}
                  </span>
                </>
              )}
            </button>
            {images.length > 1 && (
              <div className="project-gallery__thumbs">
                {images.map((img, i) => (
                  <button key={img + i} className={i === active ? "active" : ""} onClick={() => setActive(i)}>
                    <img src={getImageUrl(img)} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="project-detail__text">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="project-detail__cta">
          <strong>{t("orderCta")}</strong>
          <Link href="/order" className="hero-btn hero-btn--dark">
            {t("orderBtn")} <EastIcon fontSize="small" />
          </Link>
        </div>
      </div>

      {lightbox && (
        <div className="project-lightbox" onClick={() => setLightbox(false)}>
          <button className="project-lightbox__close" aria-label="close">
            <CloseIcon />
          </button>
          <img src={getImageUrl(images[active])} alt="" onClick={(e) => e.stopPropagation()} />
          {images.length > 1 && (
            <>
              <button className="project-lightbox__nav project-lightbox__nav--prev" onClick={(e) => { e.stopPropagation(); step(-1); }}>
                <WestIcon />
              </button>
              <button className="project-lightbox__nav project-lightbox__nav--next" onClick={(e) => { e.stopPropagation(); step(1); }}>
                <EastIcon />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default withLayoutBasic(ProjectDetail);
