import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { DateTime } from "luxon";
import { DeletePasteModal } from "../Modals/DeletePasteModal";
import { useUser } from "../Context/CurrentUserContext";

interface Props
{
	id: Number,
	title: string,
	author: any,
	createdAt: Date
	updatedAt: Date,
	refetch: () => {}
	returnTo: string,
}

const PasteRow = ({ id, title, author, createdAt, updatedAt, refetch, returnTo }: Props) =>
{
	const navigate = useNavigate();
	const [isDeleteVisible, setDeleteVisible] = useState<boolean>(false);
	const formattedCreatedAt = DateTime.fromJSDate(new Date(createdAt)).toFormat("yyyy-MM-dd HH:mm");
	const formattedUpdatedAt = DateTime.fromJSDate(new Date(updatedAt)).toFormat("yyyy-MM-dd HH:mm");
	const { user } = useUser();

	return (
		<>
		<DeletePasteModal id={id} title={title} isVisible={isDeleteVisible} setVisible={setDeleteVisible} refetch={refetch} />
		<tr>
			<td ><Button variant="link" onClick={() => navigate(`/paste/${id}?next=${returnTo}`)}>{title}</Button></td>
			<td className="text-muted" style={{ verticalAlign: "middle" }}>{formattedCreatedAt}</td>
			<td className="text-muted" style={{ verticalAlign: "middle" }}>{formattedUpdatedAt}</td>
			{(user && (user?.isStaff || user.id == author.id)) ? <td><Button className="paste-delete-button" variant="link" onClick={() => { setDeleteVisible(true) }}>X</Button></td>: <td></td>}
		</tr>
		</>
	);
};

export default PasteRow;
