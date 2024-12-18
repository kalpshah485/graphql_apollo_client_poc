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


  // Block requests if no token is present
  if (!currentToken) throw new Error("Authentication token is missing. Request blocked.");

  // If token exists, set the Authorization header
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ3ZWJhcHAiOnRydWUsInZlcnNpb24iOjQsImlhdCI6MTczNDUxNjAzNiwiZXhwIjoxNzM0NTU5MjM2LCJhdWQiOlsiaHR0cHM6Ly9hcGktYXAtc291dGgtMS5oeWdyYXBoLmNvbS92Mi9jbHVzOXgxcXYwMDAwMDF3YThqemFhaDY1L21hc3RlciJdLCJpc3MiOiJodHRwczovL21hbmFnZW1lbnQtYXAtc291dGgtMS5oeWdyYXBoLmNvbS8iLCJzdWIiOiI1NTc2ZDhmZi04MTRhLTQ5NDAtOGU5Yy0zZWQ2MjVhMTFkOWMiLCJqdGkiOiJjbTR0bTVkN3QwYjd2MDdwaDdoeHE2cnYwIn0.VpNMmdEy9sJzkCMzp527EtZXTDvUxZLzmUlrz6RpMXq3YEAh5XXqkgACyGyx8duNYvPjF4ilpRlQPeYxopMwh4e09UyKwzQZ9SJJGCL5JWnsroLl8SZX67gz0eauQDa_EM7WMjs61nRtNNl1xSSz5fHT7klkl0nWl2rGSZ3PjcoBisp3b6y470Tm-nW8VcvvNCQ0XHxtO_v2g7RBoTqK7HLCsQiS9Ri2HvqCzs934H6nPJyX3WDbWk-bRc3_GAFrX57XxmPuKYcX16nTN8AEskRATgnNDncOfqgbRXXW3lW-Fu1H8HHsxxiF4sF1fAhlIP2ASlwUnMqbgJPjnSFaGZNorJvvPjLbw7K_mrQVzHuCBLbByFsGnKSatY1hwSd1UbPfBGS-ea_Dkxa2qvFsKCy6te_UkxpUWXAUZ_4PYYLnG7aBrITxQJtFKESgz6Qji66iR13G7Qm_YjezTMM6T_YVxx46f6Zky82FyrDnpX6yQtCS95ty2yg58or1Dh6Fh6FhKWs82PjtbAX1r7aZSjJU2ALWdgLgrLOaQX_FRXRpfrZeiTvPazWdqQFpN8Huq_F2nG-WFe_umusWDiozwPx1DsD02N2ukzWoRdqwH2LP4R9n25VEcxmp7j5uR5mkwXh6GWyX0rDv4XrYHYrbchRqzP97yVSitM-yyhIzDnw`,
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

// Dynamic Link to route requests to the correct GraphQL URL
const dynamicLink = new ApolloLink((operation, forward) => {
  const { operationName } = operation;

  // Route based on the operation name (or any other custom logic)
  const httpLink = operationName.includes("Characters") // Example for Service 1
    ? httpLink1
    : httpLink2; // Default to Service 3

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
    },
  }),
});

export default client;
