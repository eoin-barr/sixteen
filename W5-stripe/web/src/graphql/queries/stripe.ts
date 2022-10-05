import { gql } from '@apollo/client';

export const GET_CLIENT_SECRET = gql`
  query StripeClientSecretQuery {
    clientSecret {
      clientSecretValue
    }
  }
`;

export const GET_CHECKOUT_URL = gql`
  query StripeClientCheckoutUrlQuery($priceID: String!) {
    clientCheckout(priceID: $priceID) {
      clientCheckoutUrl
    }
  }
`;

export const GET_SUBSCRIPTION_STATUS = gql`
  query StripeSubscriptionStatusQuery {
    subscription {
      subscribed
    }
  }
`;
