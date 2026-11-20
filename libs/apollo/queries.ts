import { gql } from "@apollo/client";

const SERVICE_FIELDS = gql`
  fragment ServiceFields on Service {
    _id
    serviceCollection
    serviceTitle
    serviceType
    serviceStatus
    serviceDetail
    serviceArea
    servicePrice
    serviceDesc
    serviceImages
    serviceViews
    createdAt
  }
`;

export const GET_SERVICES = gql`
  ${SERVICE_FIELDS}
  query GetServices($input: ServicesInquiry!) {
    getServices(input: $input) {
      list {
        ...ServiceFields
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_SERVICE = gql`
  ${SERVICE_FIELDS}
  query GetService($serviceId: String!) {
    getService(serviceId: $serviceId) {
      ...ServiceFields
    }
  }
`;

const MEMBER_AUTH_FIELDS = `
  _id
  memberNick
  memberPhone
  memberType
  memberImage
  accessToken
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      ${MEMBER_AUTH_FIELDS}
    }
  }
`;

export const SIGNUP = gql`
  mutation Signup($input: MemberInput!) {
    signup(input: $input) {
      ${MEMBER_AUTH_FIELDS}
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: OrderInput!) {
    createOrder(input: $input) {
      _id
      orderStatus
    }
  }
`;

// Eslatma: Order.member maydoni so'ralmaydi — backend myOrder'da uni qaytarmaydi
export const MY_ORDERS = gql`
  query MyOrder {
    myOrder {
      list {
        _id
        phone
        orderStatus
        serviceCollection
        serviceDetail
        serviceType
        serviceArea
        createdAt
      }
      metaCounter {
        total
      }
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation CancelOrder($input: OrderUpdate!) {
    updateOrder(input: $input) {
      _id
      orderStatus
    }
  }
`;
