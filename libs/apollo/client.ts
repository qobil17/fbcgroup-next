import { ApolloClient, HttpLink, InMemoryCache, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { GRAPHQL_URL } from "../config";
import { getToken, logout } from "../auth";

const authLink = setContext((_, { headers }) => {
  const token = getToken();
  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

const errorLink = onError(({ graphQLErrors }) => {
  // Token eskirgan yoki noto'g'ri bo'lsa — chiqib ketamiz
  if (graphQLErrors?.some((e: any) => e.code === "UNAUTHENTICATED" || /jwt|token/i.test(e.message))) {
    logout();
  }
});

let client: ApolloClient<any> | null = null;

export const getApolloClient = () => {
  if (client && typeof window !== "undefined") return client;
  const newClient = new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: from([errorLink, authLink, new HttpLink({ uri: GRAPHQL_URL })]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { fetchPolicy: "cache-and-network" },
    },
  });
  if (typeof window !== "undefined") client = newClient;
  return newClient;
};

// Backend xato xabarini o'quvchiga tushunarli qilib olish
export const errorMessage = (err: any): string => {
  const gql = err?.graphQLErrors?.[0]?.message;
  if (gql) return Array.isArray(gql) ? gql.join(", ") : gql;
  if (err?.networkError) return "Server bilan bog'lanib bo'lmadi. Keyinroq urinib ko'ring.";
  return err?.message ?? "Xatolik yuz berdi";
};
