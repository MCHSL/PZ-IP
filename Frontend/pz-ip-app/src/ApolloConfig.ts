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

function getCookie(name: string) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const tokenLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "X-CSRFToken": getCookie("csrftoken"),
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
