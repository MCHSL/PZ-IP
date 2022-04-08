import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import LoginPage from "./Components/Login/LoginPage";
import UserList from "./Components/UsersList/UsersList";
import { UserProvider } from "./Components/Context/CurrentUserContext";
import PasteIndex from "./Components/Paste/PasteIndex";
import CreatePaste from "./Components/Paste/CreatePaste";
import ProfilePage from "./Components/Profile/ProfilePage";
import Menu from "./Components/Menu/Menu";
import AllPastes from "./Components/Paste/AllPastes";
import CurrentUserProfilePage from "./Components/Profile/CurrentUserProfilePage";
import client from "./ApolloConfig";
import PasswordReset from "./Components/Login/PasswordResetComponent";
import RequestPasswordReset from "./Components/Login/RequestPasswordReset";

function App() {
  return (
    <ApolloProvider client={client}>
      <UserProvider>
        <Router>
          <Menu />
          <Routes>
            <Route path="/" element={<CreatePaste />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/paste/:id" element={<PasteIndex />} />
            <Route path="/paste/new" element={<CreatePaste />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/profile" element={<CurrentUserProfilePage />} />
            <Route path="/pastes" element={<AllPastes />} />
            <Route path="/password_reset/:token" element={<PasswordReset />} />
            <Route path="/req_reset" element={<RequestPasswordReset />} />
          </Routes>
        </Router>
      </UserProvider>
    </ApolloProvider>
  );
}

export default App;
