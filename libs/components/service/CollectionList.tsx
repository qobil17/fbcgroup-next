import { Box, CircularProgress, Pagination, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useRouter } from "next/router";
import ServiceCard from "../homepage/ServiceCard";
import { useServices } from "../../hooks/useServices";
import { ServiceCollection } from "../../types";

const PAGE_SIZE = 9;

interface Props {
  collection: ServiceCollection;
  title: string;
}

const CollectionList = ({ collection, title }: Props) => {
  const router = useRouter();
  const page = Math.max(1, Number(router.query.page) || 1);
  const sort = (router.query.sort as "createdAt" | "serviceViews" | "servicePrice") || "createdAt";

  const { services, total, loading, error } = useServices({ collection, page, limit: PAGE_SIZE, sort });
  const pageCount = Math.ceil(total / PAGE_SIZE);

  const setQuery = (patch: Record<string, string | number>) =>
    router.push({ pathname: router.pathname, query: { ...router.query, ...patch } }, undefined, {
      shallow: true,
      scroll: false,
    });

  return (
    <Stack className="home-page collection-page">
      <Stack className="container">
        <Box className="collection-head">
          <h1>{title}</h1>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={sort}
            onChange={(_, v) => v && setQuery({ sort: v, page: 1 })}
          >
            <ToggleButton value="createdAt">Yangi</ToggleButton>
            <ToggleButton value="serviceViews">Ommabop</ToggleButton>
            <ToggleButton value="servicePrice">Narx</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {loading && services.length === 0 ? (
          <Box className="collection-empty">
            <CircularProgress />
          </Box>
        ) : error && services.length === 0 ? (
          <Box className="collection-empty">Xizmatlarni yuklab bo'lmadi. Keyinroq urinib ko'ring.</Box>
        ) : services.length === 0 ? (
          <Box className="collection-empty">Hozircha xizmatlar mavjud emas</Box>
        ) : (
          <div className="collection-grid">
            {services.map((s) => (
              <ServiceCard key={s._id} service={s} />
            ))}
          </div>
        )}

        {pageCount > 1 && (
          <Stack alignItems="center" sx={{ mt: 5 }}>
            <Pagination
              count={pageCount}
              page={page}
              color="primary"
              onChange={(_, p) => setQuery({ page: p })}
            />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default CollectionList;
