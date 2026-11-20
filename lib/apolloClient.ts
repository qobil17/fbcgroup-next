import { ApolloClient, InMemoryCache, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const GQL_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3007/graphql";

// createUploadLink handles both regular JSON requests and multipart file uploads.
// It automatically sets 'apollo-require-preflight: true' on multipart requests.
const uploadLink = createUploadLink({
  uri: GQL_URL,
  headers: {
    "apollo-require-preflight": "true",
  },
});

const authLink = setContext((operation, { headers }) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;
  return {
    headers: {
      ...headers,
      "x-apollo-operation-name": operation.operationName ?? "anonymous",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

const client = new ApolloClient({
  link: from([authLink, uploadLink as any]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: "cache-and-network" },
    query: { fetchPolicy: "network-only", errorPolicy: "all" },
  },
});

export default client;
