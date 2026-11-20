import Link from "next/link";
import { useQuery } from "@apollo/client";
import { useTranslations } from "next-intl";
import EastIcon from "@mui/icons-material/East";
import ProjectCard from "../projects/ProjectCard";
import { GET_PROJECTS, Project } from "../../../lib/projects";

// Bosh sahifa: so'nggi 3 ta loyiha. Loyiha bo'lmasa bo'lim umuman ko'rinmaydi.
const LatestProjects = () => {
  const t = useTranslations("projects");
  const { data } = useQuery(GET_PROJECTS, { variables: { input: { page: 1, limit: 3 } } });
  const projects: Project[] = data?.getProjects?.list ?? [];
  if (projects.length === 0) return null;

  return (
    <section className="home-block">
      <div className="home-block__inner">
        <div className="home-block__head">
          <div>
            <span className="home-block__eyebrow">{t("title")}</span>
            <h2 className="home-block__title">{t("latest")}</h2>
          </div>
          <Link href="/projects" className="home-block__link">
            {t("viewAll")} <EastIcon fontSize="small" />
          </Link>
        </div>
        <div className="projects-grid">
          {projects.map((p) => (
            <ProjectCard key={p._id} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestProjects;
