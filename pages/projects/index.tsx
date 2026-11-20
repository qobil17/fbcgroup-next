import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { useTranslations } from "next-intl";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import ProjectCard from "../../libs/components/projects/ProjectCard";
import { GET_PROJECTS, Project } from "../../lib/projects";

const PAGE_SIZE = 9;
const FILTERS = [
  { value: "", label: "all" },
  { value: "HPLINE", label: "HPLINE" },
  { value: "ALIF", label: "ALIF LIGHT" },
];

const ProjectsPage = () => {
  const t = useTranslations("projects");
  const router = useRouter();
  const page = Math.max(1, Number(router.query.page) || 1);
  const collection = typeof router.query.c === "string" ? router.query.c : "";

  const { data, loading, error } = useQuery(GET_PROJECTS, {
    variables: { input: { page, limit: PAGE_SIZE, ...(collection ? { projectCollection: collection } : {}) } },
  });

  const projects: Project[] = data?.getProjects?.list ?? [];
  const total: number = data?.getProjects?.metaCounter?.[0]?.total ?? 0;
  const pages = Math.ceil(total / PAGE_SIZE);

  const go = (q: Record<string, string | number>) =>
    router.push({ pathname: "/projects", query: { ...router.query, ...q } }, undefined, { shallow: true, scroll: false });

  return (
    <div className="projects-page">
      <div className="projects-page__inner">
        <div className="projects-filter">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={`projects-filter__btn${collection === f.value ? " active" : ""}`}
              onClick={() => go({ c: f.value, page: 1 })}
            >
              {f.label === "all" ? t("all") : f.label}
            </button>
          ))}
        </div>

        {loading && !data ? (
          <div className="projects-empty">{t("loading")}</div>
        ) : error && !data ? (
          <div className="projects-empty">{t("empty")}</div>
        ) : projects.length === 0 ? (
          <div className="projects-empty">{t("empty")}</div>
        ) : (
          <div className="projects-grid">
            {projects.map((p) => (
              <ProjectCard key={p._id} project={p} />
            ))}
          </div>
        )}

        {pages > 1 && (
          <div className="projects-pagination">
            <button disabled={page <= 1} onClick={() => go({ page: page - 1 })} aria-label={t("prev")}>‹</button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={p === page ? "active" : ""} onClick={() => go({ page: p })}>
                {p}
              </button>
            ))}
            <button disabled={page >= pages} onClick={() => go({ page: page + 1 })} aria-label={t("next")}>›</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default withLayoutBasic(ProjectsPage, { subtitleKey: "projects.subtitle" });
