import { useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useUser } from "../Context/CurrentUserContext";

import LoginComponent from "./LoginComponent";
import RegisterComponent from "./RegisterComponent";

const LoginPage = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const { user, userLoading } = useUser();
  const location = useLocation();

  if (user && !userLoading) {
    const newLoc = location.state
      ? (location.state as any).returnTo
      : "/profile";
    return <Navigate to={newLoc} replace />;
  }

  function toggleMenu() {
    setIsLoggingIn(!isLoggingIn);
  }

  return (
    <div className="container col-3 mt-5">
      {isLoggingIn ? (
        <LoginComponent setRegistering={toggleMenu} />
      ) : (
        <RegisterComponent setLoggingIn={toggleMenu} />
      )}
    </div>
  );
};
export default LoginPage;
