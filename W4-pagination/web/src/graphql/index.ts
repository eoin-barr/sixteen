import { gql } from '@apollo/client';

export const GET_REPOS = gql`
  query RepoSummary($offset: Int!, $limit: Int!) {
    repoSummary(offset: $offset, limit: $limit) {
      repos {
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
