import { Stack } from "react-bootstrap";
import PasteList from "../Paste/PasteList";

const AllPastes = () =>
{
	return (
		<Stack gap={3} className="col-md-5 m-auto mt-5">
			<PasteList currentUserOnly={false}/>
		</Stack>
	)
}

export default AllPastes;
