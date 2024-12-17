import { ApolloClient, InMemoryCache, ApolloLink, HttpLink, makeVar } from "@apollo/client";
import { RestLink } from "apollo-link-rest";

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

  console.log(operation);

  // Block requests if no token is present
  if (!currentToken) throw new Error("Authentication token is missing. Request blocked.");

  // If token exists, set the Authorization header
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      Authorization: `Bearer ${currentToken}`,
    },
  }));

  // Proceed with the request
  return forward(operation);
});

const httpLink = new HttpLink({
  uri: environment.VITE_APP_BASE_URL,
  credentials: "include",
});
const link = ApolloLink.from([restLink, authMiddleware, httpLink]);

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
    },
  }),
});

export default client;
