import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/CurrentUserContext";

import LoginComponent from "./LoginComponent";
import RegisterComponent from "./RegisterComponent";

const LoginPage = () =>
{
	const [isLoggingIn, setIsLoggingIn] = useState(true);
	const { user } = useUser();
	const navigate = useNavigate();

	if (user)
	{
		navigate("/profile");
		return null;
	}

	function toggleMenu()
	{
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
