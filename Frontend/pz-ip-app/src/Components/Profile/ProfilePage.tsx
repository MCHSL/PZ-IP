import { Stack } from "react-bootstrap";
import PasteList from "../Paste/PasteList";
import { useUser } from "../Context/CurrentUserContext";
import { useNavigate } from "react-router-dom";


const ProfilePage = () =>
{
	const { userLoading, user } = useUser();
	const navigate = useNavigate();

	if (!user && !userLoading)
	{
		navigate("/login");
		return null;
	}

	return (
		<Stack gap={3} className="col-md-5 m-auto mt-5">
			<PasteList currentUserOnly={true} />
		</Stack>
	)
}

export default ProfilePage;
