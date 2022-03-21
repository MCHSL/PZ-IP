import { Stack } from "react-bootstrap";
import PasteList from "../Paste/PasteList";
import CurrentUser from "../UsersList/CurrentUser";

const ProfilePage = () =>
{
	return (
		<Stack gap={3} className="col-md-5 m-auto mt-5">
			<PasteList currentUserOnly={true}/>
		</Stack>
	)
}

export default ProfilePage;
