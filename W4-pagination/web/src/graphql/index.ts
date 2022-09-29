import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query PostSummary($offset: Int!, $limit: Int!) {
    postSummary(offset: $offset, limit: $limit) {
      posts {
        id
        title
      }
      count
    }
  }
`;

export const ALL_PROJETS = gql`
  query Projects($first: Int, $after: Int) {
    projects(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          name
          image
        }
      }
    }
  }
`;
