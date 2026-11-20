import { gql } from "@apollo/client";

// Hamkorlar uchun GraphQL so'rovlari va turlar

export interface Partner {
  _id: string;
  partnerName: string;
  partnerLogo: string;
  partnerLink?: string | null;
  partnerDesc?: string | null;
  partnerOrder: number;
  partnerStatus: "ACTIVE" | "HIDDEN";
}

export const PARTNER_FIELDS = `
  _id
  partnerName
  partnerLogo
  partnerLink
  partnerDesc
  partnerOrder
  partnerStatus
`;

export const GET_PARTNERS = gql`
  query GetPartners {
    getPartners { ${PARTNER_FIELDS} }
  }
`;

// Admin panel uchun (gqlRequest bilan ishlatiladi — oddiy matn)
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
