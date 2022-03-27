import PasteList from "../Paste/PasteList";
import { Stack } from "react-bootstrap";
import withLogin from "../Misc/LoginRequired";


const ProfilePage = () =>
{
	return (
		<Stack gap={3} className="col-md-5 m-auto mt-5">
			<PasteList currentUserOnly={true} />
		</Stack>
	)
}

export default withLogin(ProfilePage);
