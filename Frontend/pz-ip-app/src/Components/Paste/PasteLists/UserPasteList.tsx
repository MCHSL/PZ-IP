import { useQuery } from "@apollo/client";
import { useState } from "react";
import { getPasteTitlesPaginated } from "../../../Queries/PaginatingQuery";
import { get_paste_titles_for_user } from "../../../Queries/queries";
import PasteList from "./Base/PasteList";

interface Props
{
	userId: number,
}


export const UserPasteList = ({ userId }: Props) =>
{
	const [page, setPage] = useState(0);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	const { loading, error, previousData, data = previousData, refetch } = getPasteTitlesPaginated(userId, page, itemsPerPage);

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

	const { pastes, pasteCount: totalItems } = data.user;

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
