import { gql } from "@apollo/client";

// Qilingan ishlar (loyihalar) va Hamkorlar uchun GraphQL so'rovlari va turlar

export interface Project {
  _id: string;
  projectTitle: string;
  projectDesc: string;
  projectCollection?: "HPLINE" | "ALIF" | null;
  projectLocation?: string | null;
  projectDate?: string | null;
  projectImages: string[];
  projectStatus: "ACTIVE" | "HIDDEN";
  projectViews: number;
  createdAt: string;
}

export interface Partner {
  _id: string;
  partnerName: string;
  partnerLogo: string;
  partnerLink?: string | null;
  partnerDesc?: string | null;
  partnerOrder: number;
  partnerStatus: "ACTIVE" | "HIDDEN";
}

const PROJECT_FIELDS = `
  _id
  projectTitle
  projectDesc
  projectCollection
  projectLocation
  projectDate
  projectImages
  projectStatus
  projectViews
  createdAt
`;

export const PARTNER_FIELDS = `
  _id
  partnerName
  partnerLogo
  partnerLink
  partnerDesc
  partnerOrder
  partnerStatus
`;

export const GET_PROJECTS = gql`
  query GetProjects($input: ProjectsInquiry!) {
    getProjects(input: $input) {
      list { ${PROJECT_FIELDS} }
      metaCounter { total }
    }
  }
`;

export const GET_PROJECT = gql`
  query GetProject($projectId: String!) {
    getProject(projectId: $projectId) { ${PROJECT_FIELDS} }
  }
`;

export const GET_PARTNERS = gql`
  query GetPartners {
    getPartners { ${PARTNER_FIELDS} }
  }
`;

// Admin panel uchun (gqlRequest bilan ishlatiladi — oddiy matn)
export const ADMIN_GET_PROJECTS = `
  query GetAllProjectsByAdmin($input: ProjectsInquiry!) {
    getAllProjectsByAdmin(input: $input) {
      list { ${PROJECT_FIELDS} }
      metaCounter { total }
    }
  }
`;
export const ADMIN_CREATE_PROJECT = `
  mutation CreateProject($input: ProjectInput!) { createProject(input: $input) { _id } }
`;
export const ADMIN_UPDATE_PROJECT = `
  mutation UpdateProject($input: ProjectUpdate!) { updateProject(input: $input) { _id } }
`;
export const ADMIN_REMOVE_PROJECT = `
  mutation RemoveProjectByAdmin($projectId: String!) { removeProjectByAdmin(projectId: $projectId) { _id } }
`;
export const ADMIN_GET_PARTNERS = `
  query GetAllPartnersByAdmin { getAllPartnersByAdmin { ${PARTNER_FIELDS} } }
`;
export const ADMIN_CREATE_PARTNER = `
  mutation CreatePartner($input: PartnerInput!) { createPartner(input: $input) { _id } }
`;
export const ADMIN_UPDATE_PARTNER = `
  mutation UpdatePartner($input: PartnerUpdate!) { updatePartner(input: $input) { _id } }
`;
export const ADMIN_REMOVE_PARTNER = `
  mutation RemovePartnerByAdmin($partnerId: String!) { removePartnerByAdmin(partnerId: $partnerId) { _id } }
`;

const MONTHS: Record<string, string[]> = {
  uz: ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"],
  ru: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

/** "2026-05-14" → "14 may 2026" (tanlangan tilda) */
export const formatProjectDate = (iso?: string | null, locale = "uz"): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const m = (MONTHS[locale] ?? MONTHS.uz)[d.getMonth()];
  return locale === "en" ? `${m} ${d.getDate()}, ${d.getFullYear()}` : `${d.getDate()} ${m} ${d.getFullYear()}`;
};
