import {
  ApolloLink,
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const roundTripLink = new ApolloLink((operation, forward) => {
  console.log(`Starting operation ${operation.operationName}`);
  operation.setContext({ start: new Date() });
  return forward(operation).map((data) => {
    const time = Date.now() - operation.getContext().start;
    console.log(
      `Operation ${operation.operationName} took ${time}ms to complete`
    );
    return data;
  });
});

const tokenLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const httpLink = createHttpLink({
  uri: "http://localhost/graphql/",
  credentials: "include",
});

const client = new ApolloClient({
  connectToDevTools: true,
  cache: new InMemoryCache(),
  link: from([roundTripLink, tokenLink, httpLink]),
});

export default client;
