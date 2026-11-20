import Link from "next/link";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import { Project, formatProjectDate } from "../../../lib/projects";
import { getImageUrl } from "../../../lib/uploadImage";
import { useLocaleContext } from "../../../lib/LocaleContext";

const ProjectCard = ({ project }: { project: Project }) => {
  const { locale } = useLocaleContext();
  const cover = getImageUrl(project.projectImages?.[0]) || "/img/banner/basicBanner-m.webp";
  const date = formatProjectDate(project.projectDate ?? project.createdAt, locale);

  return (
    <Link href={`/projects/${project._id}`} className="project-card">
      <div className="project-card__media">
        <img src={cover} alt={project.projectTitle} loading="lazy" />
        {project.projectCollection && (
          <span className="project-card__tag">{project.projectCollection === "ALIF" ? "ALIF LIGHT" : "HPLINE"}</span>
        )}
        {project.projectImages.length > 1 && (
          <span className="project-card__count">
            <PhotoLibraryOutlinedIcon fontSize="inherit" /> {project.projectImages.length}
          </span>
        )}
      </div>
      <div className="project-card__body">
        <span className="project-card__date">{date}</span>
        <h3 className="project-card__title">{project.projectTitle}</h3>
        {project.projectLocation && (
          <span className="project-card__location">
            <PlaceOutlinedIcon fontSize="inherit" /> {project.projectLocation}
          </span>
        )}
      </div>
    </Link>
  );
};

export default ProjectCard;
