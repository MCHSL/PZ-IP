import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import LoginPage from "./Components/LoginPage/LoginPage";
import UserList from "./Components/UsersList/UsersList";
import { setContext } from "@apollo/client/link/context";
import { createHttpLink } from "@apollo/client";
import { UserProvider } from "./Components/Context/CurrentUserContext";
import PasteIndex from "./Components/Paste/PasteIndex";
import CreatePaste from "./Components/Paste/CreatePaste";
import ProfilePage from "./Components/Profile/ProfilePage";
import Menu from "./Components/Menu/Menu";
import AllPastes from "./Components/Paste/AllPastes";

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
		uri: "http://localhost/graphql/",
	});

	const client = new ApolloClient({
		cache: new InMemoryCache(),
		link: authLink.concat(httpLink),
	});

	return (
		<ApolloProvider client={client}>
			<UserProvider>
				<Router>
					<Menu />
					<Routes>
						<Route path="/" element={<CreatePaste />}></Route>
						<Route path="/login" element={<LoginPage />}></Route>
						<Route path="/users" element={<UserList />}></Route>
						<Route path="/paste/:id" element={<PasteIndex />}></Route>
						<Route path="/paste/new" element={<CreatePaste />}></Route>
						<Route path="/profile" element={<ProfilePage />}></Route>
						<Route path="/pastes" element={<AllPastes />}></Route>
					</Routes>
				</Router>
			</UserProvider>
		</ApolloProvider >
	);
}

export default App;
