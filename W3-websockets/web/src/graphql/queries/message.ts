import { gql } from '@apollo/client';

export const GET_ALL_MESSAGES = gql`
  query Messages {
    messages {
      id
      text
      userId
    }
  }
`;

export const MESSAGES_SUBSCRIPTION = gql`
  subscription {
    createMessage {
      id
      text
      userId
    }
  }
`;

export const CREATE_MESSAGE = gql`
  mutation CreateMessage($text: String!, $userId: Int!) {
    createMessage(text: $text, userId: $userId) {
      text
      id
      userId
    }
  }
`;
