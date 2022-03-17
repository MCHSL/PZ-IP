import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import LoginPage from "./Components/LoginPage/LoginPage";
import UserList from "./Components/UsersList/UsersList";
import { setContext } from "@apollo/client/link/context";
import { createHttpLink } from "@apollo/client";

function App()
{
	const authLink = setContext((_, { headers }) =>
	{
		const token = localStorage.getItem("token");
		return {
			headers: {
				...headers,
				authorization: token ? `JWT ${token}` : "",
			},
		};
	});

	const httpLink = createHttpLink({
		uri: "http://localhost/graphql",
	});

	const client = new ApolloClient({
		cache: new InMemoryCache(),
		link: authLink.concat(httpLink),
	});

	return (
		<ApolloProvider client={client}>
			<Router>
				<Routes>
					<Route path="/login" element={<LoginPage />}></Route>
					<Route path="/" element={<UserList />}></Route>
				</Routes>
			</Router>
		</ApolloProvider>
	);
}

export default App;
