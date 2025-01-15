import { ApolloClient, InMemoryCache, ApolloLink, HttpLink, makeVar, split } from "@apollo/client";
import { RestLink } from "apollo-link-rest";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const environment = import.meta.env;

const token = localStorage.getItem("token") || null;
export const tokenVar = makeVar(token);

const restLink = new RestLink({
  uri: environment.VITE_APP_LOGIN_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const authMiddleware = new ApolloLink((operation, forward) => {
  const currentToken = localStorage.getItem("token");

  // Block requests if no token is present
  if (!currentToken) throw new Error("Authentication token is missing. Request blocked.");

  // If token exists, set the Authorization header
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      Authorization: environment.VITE_APP_BEARER_TOKEN,
    },
  }));

  // Proceed with the request
  return forward(operation);
});

const httpLink1 = new HttpLink({
  uri: environment.VITE_APP_BASE_URL_1,
  credentials: "include",
});

const httpLink2 = new HttpLink({
  uri: environment.VITE_APP_BASE_URL_2,
});

const httpLink3 = new HttpLink({
  uri: environment.VITE_APP_BASE_URL_3,
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4000/graphql",
  }),
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink3,
);

// Dynamic Link to route requests to the correct GraphQL URL
const dynamicLink = new ApolloLink((operation, forward) => {
  const { operationName } = operation;

  // Route based on the operation name (or any other custom logic)
  const httpLink = operationName.includes("Character") // Example for Service 1
    ? httpLink1
    : operationName.includes("Launch")
      ? httpLink2
      : splitLink; // Default to Service 3

  // Forward the request to the selected link
  return httpLink.request(operation, forward);
});

const link = ApolloLink.from([restLink, authMiddleware, dynamicLink]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache({
    typePolicies: {
      Character: {
        fields: {
          count: {
            read(existing = 0) {
              return existing; // Default value for 'count'
            },
          },
        },
      },
      Launch: {
        fields: {
          count: {
            read(existing = 0) {
              return existing;
            },
          },
        },
      },
    },
  }),
});

export default client;
