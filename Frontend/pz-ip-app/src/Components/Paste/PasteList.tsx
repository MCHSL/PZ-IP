import { Button, Card, ListGroup, Table } from "react-bootstrap";
import { useUser } from "../Context/CurrentUserContext";
import PasteRow from "./PasteRow";
import { useState } from "react";
import PaginableList from "../List/PaginatingList";
import { getPasteTitlesPaginated } from "../../Queries/PaginatingQuery";
import Countdown from 'react-countdown';

interface PasteInfo
{
	id: Number,
	title: string,
	author: any,
	createdAt: Date,
	updatedAt: Date
}

interface Props {
	currentUserOnly: boolean
}

const PasteList = ({currentUserOnly}: Props) =>
{
	const [page, setPage] = useState(0);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [refetching, setRefetching] = useState(false);
	const { userLoading, user } = useUser();
	const { loading, error, previousData, data = previousData, refetch } = getPasteTitlesPaginated(currentUserOnly ? Number(user?.id) : null, page, itemsPerPage, userLoading);

	console.log("rendering list");

	let message = null;
	/*if (loading && !previousData)
	{
		message =
			(<div>
				<h1>Ładowanie...</h1>
			</div>)
	}
	else if (error)
	{
		console.log("errored")
		message =
			(<div>
				<h1>Wystąpił błąd podczas ładowania.</h1>
				<span className={"text-muted"}><span>Nowa próba za</span><Countdown date={Date.now() + 5000} onComplete={reloading} renderer={props => { return <>{props.seconds}</> }} />...</span>
			</div>)
	}*/

	const pastes = (currentUserOnly ? data?.user?.pastes : data?.pastes) ?? [];

	return (
		<PaginableList visible={!loading && !userLoading} totalItems={currentUserOnly ? data?.user?.pasteCount : data?.pasteCount} page={page} setPage={setPage} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage}>
			<Table striped hover size="sm">
				<thead>
					<tr>
						<th className="text-muted col-5">Tytuł</th>
						<th className="text-muted col-4">Utworzona</th>
						<th className="text-muted col-4">Zmieniona</th>
						<th className="text-muted col-4"></th>
					</tr>
				</thead>
				<tbody>
					{pastes.map((paste: PasteInfo) =>
					{
						return (
							<PasteRow key={paste.id.toString()} id={paste.id} title={paste.title} author={paste.author} createdAt={paste.createdAt} updatedAt={paste.updatedAt} refetch={refetch} returnTo={currentUserOnly? "/profile" : "/pastes"} />
						);
					})}
				</tbody>
			</Table>
		</PaginableList >)
}

export default PasteList;
