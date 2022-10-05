import { gql } from '@apollo/client';

export const GET_USER_DETAILS = gql`
  query User {
    me {
      id
      email
      dateJoined
      githubID
      githubAvatarUrl
      githubUsername
      customerID
    }
  }
`;

export const GET_USER_TOKENS = gql`
  query UserTokens {
    userTokens {
      id
      displayName
      createdAt
    }
  }
`;

export const CREATE_USER_TOKEN = gql`
  mutation CreateUserToken($expiresAt: DateTime) {
    createUserToken(expiresAt: $expiresAt) {
      id
      token
      displayName
      createdAt
    }
  }
`;

export const DELETE_USER_TOKEN = gql`
  mutation DeleteUserToken($id: UUID!) {
    deleteUserToken(id: $id) {
      id
    }
  }
`;
