import { Stack } from "react-bootstrap";
import { useUser } from "../Context/CurrentUserContext";
import withLogin from "../Misc/LoginRequired";
import { UserPasteList } from "../Paste/PasteLists/UserPasteList";


const CurrentUserProfilePage = () =>
{
	const { userLoading, user } = useUser();
	if (userLoading)
	{
		return <p>Loading...</p>;
	}

	return (
		<Stack gap={3} className="col-md-5 m-auto mt-5">
			<h1>
				Twoje wklejki
			</h1>
			<UserPasteList userId={Number(user.id)} />
		</Stack>
	)
}

export default withLogin(CurrentUserProfilePage);
