import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../Context/CurrentUserContext";
import { Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

const CurrentUser = () =>
{
	const navigate = useNavigate();
	const location = useLocation();
	const { userLoading, user, logout } = useUser();

	function doLogout()
	{
		logout().finally(() => navigate("/login"));
	}

	return (
		<div className="align-middle" style={{ display: "inline" }}>
			{user ?
				<>
					<span className="text-white" style={{ verticalAlign: "sub" }}>Witaj{userLoading || !user ? "" : ", " + user.username} 👋 </span>
					<button className='btn btn-outline-light' onClick={doLogout}>
						<div style={{ display: "inline-block" }}>
							<span>Wyloguj</span>
							<FontAwesomeIcon style={{ marginLeft: "5px" }} icon={solid('right-from-bracket')} />
						</div>
					</button>
				</>
				: userLoading ?
					<Spinner animation="border" size="sm" />
					:
					<button className='btn btn-outline-light' onClick={() => navigate(`/login`, { state: { returnTo: location.pathname } })}>
						<div style={{ display: "inline-block" }}>
							<span>Zaloguj</span>
							<FontAwesomeIcon style={{ marginLeft: "5px" }} icon={solid('right-to-bracket')} />
						</div>
					</button>
			}
		</div >
	);
};

export default CurrentUser;
