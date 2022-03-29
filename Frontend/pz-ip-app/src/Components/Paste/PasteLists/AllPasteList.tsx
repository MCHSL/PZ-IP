import { useQuery } from "@apollo/client";
import { useState } from "react";
import { getPasteTitlesPaginated } from "../../../Queries/PaginatingQuery";
import { get_paste_titles } from "../../../Queries/queries";
import PasteList from "./Base/PasteList";


export const AllPasteList = () =>
{
	const [page, setPage] = useState(0);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	const { loading, error, previousData, data = previousData, refetch } = getPasteTitlesPaginated(null, page, itemsPerPage);

	if (loading && !data)
	{
		return (<p>Loading...</p>);
	}

	if (error)
	{
		return (<p>Error: {error.message}
			<button onClick={() => refetch()}>Retry</button>
		</p>);
	}

	const { pastes, pasteCount: totalItems } = data;

	const props = {
		pastes,
		totalItems,
		page,
		itemsPerPage,
		setPage,
		setItemsPerPage,
		refetch,
	}

	return (
		<>
			<PasteList {...props} />
		</>
	);

}
