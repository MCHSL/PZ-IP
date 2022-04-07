import {
  ApolloLink,
  ApolloClient,
  NormalizedCacheObject,
  createHttpLink,
  InMemoryCache,
  from,
  Observable,
  Operation,
} from "@apollo/client";
import { refresh } from "./Queries/queries";

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

function tokenNeedsRefresh() {
  const expiresIn = localStorage.getItem("tokenExpiresIn");
  if (!expiresIn) {
    return false;
  }
  const tokenExpiration = new Date(parseInt(expiresIn) * 1000);
  let now = new Date();
  now.setMinutes(now.getMinutes() + 1);
  return tokenExpiration < now;
}

let client: ApolloClient<NormalizedCacheObject>;

let refreshPromise: any;

const refreshTokenIfNeeded = async (op: Operation) => {
  if (
    op.operationName === "Refresh" ||
    op.operationName === "Logout" ||
    op.operationName === "Login"
  ) {
    return;
  }
  if (tokenNeedsRefresh()) {
    if (refreshPromise) {
      console.log("waiting for existing refresh to finish");
      await refreshPromise;
      console.log("existing refresh finished");
    } else {
      refreshPromise = new Promise<void>(async (resolve, reject) => {
        const data = await client.mutate({
          mutation: refresh,
        });
        localStorage.setItem(
          "tokenExpiresIn",
          data.data.refreshToken.payload.exp
        );
        refreshPromise = null;
        resolve();
      });
      console.log("awaiting triggered refresh");
      await refreshPromise;
      console.log("triggered refresh finished");
    }
  }
};

const promiseToObservable = (promise: any) =>
  new Observable((subscriber: any) => {
    promise.then(
      (value: any) => {
        if (subscriber.closed) return;
        subscriber.next(value);
        subscriber.complete();
      },
      (err: any) => subscriber.error(err)
    );
    return subscriber;
  });

const tokenRefreshLink = new ApolloLink((operation, forward) => {
  return promiseToObservable(refreshTokenIfNeeded(operation)).flatMap(() => {
    return forward(operation);
  });
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
