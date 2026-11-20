import { useQuery } from "@apollo/client";
import { GET_SERVICES } from "../apollo/queries";
import { Service, ServiceCollection } from "../types";

interface Options {
  collection?: ServiceCollection;
  page?: number;
  limit?: number;
  sort?: "createdAt" | "servicePrice" | "serviceViews";
}

export const useServices = ({ collection, page = 1, limit = 8, sort = "createdAt" }: Options = {}) => {
  const { data, loading, error, refetch } = useQuery(GET_SERVICES, {
    variables: {
      input: {
        page,
        limit,
        sort,
        direction: "DESC",
        search: collection ? { serviceCollection: collection } : {},
      },
    },
    ssr: false,
    notifyOnNetworkStatusChange: true,
  });

  const services: Service[] = data?.getServices?.list ?? [];
  const total: number = data?.getServices?.metaCounter?.[0]?.total ?? 0;
  return { services, total, loading, error, refetch };
};
