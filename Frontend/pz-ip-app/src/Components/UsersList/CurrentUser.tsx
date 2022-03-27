import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/CurrentUserContext";
import { Button, Spinner } from "react-bootstrap";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

const CurrentUser = () =>
{
	const navigate = useNavigate();
	const { userLoading, user, logout } = useUser();

	function doLogout()
	{
		logout().finally(() => navigate("/login"));
	}

	return (
		<div className="align-middle">
			{user ?
				<>
					<span className="text-white">Witaj{userLoading || !user ? "" : ", " + user.username} 👋 </span>
					<Button href="#" onClick={doLogout} variant="link" className="text-danger ml-2 p-1 align-baseline">{!user ? "Zaloguj" : "Wyloguj"}</Button>
				</>
				: userLoading ?
					<Spinner animation="border" size="sm" />
					:
					<button className='btn btn-outline-light' onClick={() => navigate("/login")}>Zaloguj!</button>
			}
		</div>
	);
};

export default CurrentUser;
