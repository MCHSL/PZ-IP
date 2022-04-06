import {
  ApolloLink,
  ApolloClient,
  NormalizedCacheObject,
  createHttpLink,
  InMemoryCache,
  from,
} from "@apollo/client";
import { refresh } from "./Queries/queries";

const roundTripLink = new ApolloLink((operation, forward) => {
  operation.setContext({ start: new Date() });
  return forward(operation).map((data) => {
    const time = Date.now() - operation.getContext().start;
    console.log(
      `Operation ${operation.operationName} took ${time}ms to complete`
    );
    return data;
  });
});

function tokenNeedsRefresh() {
  const expiresIn = localStorage.getItem("tokenExpiresIn");
  if (!expiresIn) {
    return false;
  }
  const tokenExpiration = new Date(parseInt(expiresIn));
  let now = new Date();
  now.setMinutes(now.getMinutes() + 1);
  return tokenExpiration < now;
}

let client: ApolloClient<NormalizedCacheObject>;

let isRefreshing = false;

const refreshTokenIfNeeded = async () => {
  if (!isRefreshing && tokenNeedsRefresh()) {
    isRefreshing = true;
    const data = await client.mutate({
      mutation: refresh,
    });
    localStorage.setItem(
      "tokenExpiresIn",
      data.data.refreshToken.refreshExpiresIn
    );
    isRefreshing = false;
  }
};

const tokenRefreshLink = new ApolloLink((operation, forward) => {
  if (operation.operationName !== "Logout") refreshTokenIfNeeded();
  return forward(operation);
});

const httpLink = createHttpLink({
  uri: "http://localhost/graphql/",
  credentials: "include",
});

client = new ApolloClient({
  connectToDevTools: true,
  cache: new InMemoryCache(),
  link: from([roundTripLink, tokenRefreshLink, httpLink]),
});

export default client;
