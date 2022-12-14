import { gql } from "@apollo/client";

export const REGISTER = gql`
  mutation Register($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      id
      email
      password
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      email
      password
    }
  }
`;

export const GET_USER = gql`
  query Query {
    me {
      id
      email
      stripeId
      type
    }
  }
`;

export const CREATE_STRIPE_SUBSCRIPTION = gql`
  mutation CreateStripeSubscription($source: String!) {
    createStripeSubscription(source: $source) {
      id
      email
      stripeId
    }
  }
`;
