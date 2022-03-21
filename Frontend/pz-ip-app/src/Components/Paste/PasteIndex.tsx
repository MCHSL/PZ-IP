import { useParams, useSearchParams } from "react-router-dom";
import ViewEditPaste from "./ViewEditPaste";


const PasteIndex = () =>
{
	const params = useParams();
	const [queryParams, setQueryParams] = useSearchParams();
	return (<div style={{
		width: "50%",
		margin: "auto"
	}}>
		<ViewEditPaste id={Number(params.id)} returnTo={queryParams.get("next") || "/pastes"} />
	</div>)
}

export default PasteIndex;
