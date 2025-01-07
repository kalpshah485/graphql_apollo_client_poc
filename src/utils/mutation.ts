import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($input: any) {
    login(input: $input) @rest(type: "LoginResponse", path: "/login", method: "POST", bodyKey: "input") {
      token
    }
  }
`;

export const ADD_LAUNCH = gql`
  mutation Create_Launch($name: String!, $date: DateTime!) {
    createLaunch(data: { name: $name, date: $date }) {
      id
      name
      date
    }
  }
`;

export const DELETE_LAUNCH = gql`
  mutation deleteLaunch($id: ID!) {
    deleteLaunch(where: { id: $id }) {
      id
    }
  }
`;
