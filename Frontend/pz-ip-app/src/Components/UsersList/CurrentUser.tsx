import { useNavigate } from "react-router-dom";
import { useApolloClient } from "@apollo/client";
import { useUser } from "../Context/CurrentUserContext";
import { Card } from "react-bootstrap";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

const CurrentUser = () =>
{
	const client = useApolloClient();
	const navigate = useNavigate();
	const { userLoading, user, refetchUser, logout } = useUser();

	function doLogout()
	{
		logout().finally(() => navigate("/login"));
	}

	return (
		<div className="align-middle">
			<span className="text-white">Witaj{userLoading || !user ? "" : ", " + user.username} 👋 </span>
			<a href="#" onClick={doLogout} className="text-danger ml-2">{userLoading || !user ? "Zaloguj" : "Wyloguj" }</a>
		</div>
	);
};

export default CurrentUser;
