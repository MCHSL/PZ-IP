import { Button, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { DateTime } from "luxon";
import { DeletePasteModal } from "../../../Modals/DeletePasteModal";
import { useUser } from "../../../Context/CurrentUserContext";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PasteInfo } from "../../Types";

interface Props
{
	paste: PasteInfo,
	refetch: () => {}
}

const PasteRow = ({ paste, refetch }: Props) =>
{
	const navigate = useNavigate();
	const [isDeleteVisible, setDeleteVisible] = useState<boolean>(false);
	const formattedCreatedAt = DateTime.fromJSDate(new Date(paste.createdAt)).toFormat("yyyy-MM-dd HH:mm");
	const formattedUpdatedAt = DateTime.fromJSDate(new Date(paste.updatedAt)).toFormat("yyyy-MM-dd HH:mm");
	const { user } = useUser();
	const location = useLocation();

	return (
		<>
			<DeletePasteModal id={paste.id} title={paste.title} isVisible={isDeleteVisible} setVisible={setDeleteVisible} refetch={refetch} />
			<tr>
				<td ><Button variant="link" onClick={() => navigate(`/paste/${paste.id}`, { state: { returnTo: location.pathname } })}>{paste.title}</Button></td>
				<td className="text-muted" style={{ verticalAlign: "middle" }}>{formattedCreatedAt}</td>
				<td className="text-muted" style={{ verticalAlign: "middle" }}>{formattedUpdatedAt}</td>
				<td className="text-muted" style={{ verticalAlign: "middle", textAlign: "center" }}>
					<Form.Check
						type="checkbox"
						checked={paste.isPrivate}
						disabled
					/>
				</td>
				{(user && (user?.isStaff || user.id === paste.author.id)) ? <td><Button variant="link" onClick={() => { setDeleteVisible(true) }}><FontAwesomeIcon icon={solid('trash-can')} /></Button></td> : <td></td>}
			</tr>
		</>
	);
};

export default PasteRow;
