import { Stack } from "react-bootstrap";
import { AllPasteList } from "./PasteLists/AllPasteList";

const AllPastes = () =>
{
	return (
		<Stack gap={3} className="col-md-5 m-auto mt-5">
			<AllPasteList />
		</Stack>
	)
}

export default AllPastes;
