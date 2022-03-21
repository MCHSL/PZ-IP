import { useState } from "react";

import LoginComponent from "./LoginComponent";
import RegisterComponent from "./RegisterComponent";

const LoginPage = () =>
{
	const [isLoggingIn, setIsLoggingIn] = useState(true);

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
