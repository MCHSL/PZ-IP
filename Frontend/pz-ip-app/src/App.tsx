import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes }
  from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";
import LoginPage from "./Components/LoginPage/LoginPage";
import UserList from './Components/UsersList/UsersList';

function App() {
  const client = new ApolloClient({
    uri: 'http://localhost:8000/graphql',
    cache: new InMemoryCache()
  });

  return (
    <ApolloProvider client={client}>
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/users" element={<UserList />}></Route>
      </Routes>
    </Router>
    </ApolloProvider>
  );
}

export default App;
