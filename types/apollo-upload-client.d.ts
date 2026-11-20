declare module "apollo-upload-client/createUploadLink.mjs" {
  import { ApolloLink } from "@apollo/client";
  function createUploadLink(options?: Record<string, any>): ApolloLink;
  export default createUploadLink;
}
