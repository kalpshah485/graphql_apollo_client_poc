import { gql } from "@apollo/client";

export const GET_CHARACTERS = gql(/* GraphQL */ `
  query Get_Characters {
    characters {
      results {
        id
        name
        image
        count @client
      }
    }
  }
`);

export const GET_LAUNCHES = gql`
  query Get_Launches($first: Int!, $orderBy: LaunchOrderByInput!) {
    launches(first: $first, orderBy: $orderBy) {
      id
      name
      date
      count @client
    }
  }
`;

export const GET_BLOGS = gql`
  query GetAllBlogs {
    getBlogs {
      id
      content
      author
    }
  }
`;
