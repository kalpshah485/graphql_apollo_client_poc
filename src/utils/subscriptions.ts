import { gql } from "@apollo/client";

export const SUBSCRIBE_BLOGS = gql`
  subscription BlogStream {
    newBlog {
      content
      id
      author
    }
  }
`;
