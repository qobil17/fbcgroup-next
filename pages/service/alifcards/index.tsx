import { useState } from "react";
import { Stack } from "@mui/material";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
import { useQuery, gql } from "@apollo/client";
import { useTranslations } from "next-intl";
import withLayoutBasic from "../../../libs/components/layout/LayoutBasic";
import ServiceCard from "../../../libs/components/homepage/ServiceCard";
import useDeviceDetect from "../../../libs/hooks/useDeviceDetect";

const GET_ALIF_SERVICES = gql`
  query GetAlifCards($input: ServicesInquiry!) {
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
      metaCounter {
        total
      }
    }
  }
`;

const PAGE_SIZE = 16;

const AlifAllCards = () => {
  const device = useDeviceDetect();
  const tHome = useTranslations("home");
  const tCards = useTranslations("cards");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, loading } = useQuery(GET_ALIF_SERVICES, {
    variables: {
      input: {
        page: currentPage,
        limit: PAGE_SIZE,
        search: { serviceCollection: "ALIF", serviceStatus: "ACTIVE" },
      },
    },
  });

  const services = data?.getServices?.list ?? [];
  const total: number =
    (Array.isArray(data?.getServices?.metaCounter)
      ? data.getServices.metaCounter[0]?.total
      : data?.getServices?.metaCounter?.total) ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <Stack className="service-cards-page">
      <div
        className="cards-banner"
        style={{
          background:
            "linear-gradient(135deg, #111111 0%, #111111 60%, #111111 100%)",
        }}
      />

      <h1 className="cards-title">{tHome("alifServices")}</h1>

      <div className="container">
        {loading ? (
          <div className="cards-loading">{tCards("loading")}</div>
        ) : (
          <div className="cards-grid">
            {services.map((svc: any) => (
              <ServiceCard key={svc._id} service={svc} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="cards-pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
            >
              <WestIcon />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={
                  currentPage === page ? "pagination-btn active" : "pagination-btn"
                }
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
            >
              <EastIcon />
            </button>
          </div>
        )}
      </div>
    </Stack>
  );
};

export default withLayoutBasic(AlifAllCards);
