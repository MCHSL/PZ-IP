import { useMutation } from "@apollo/client";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react"
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { create_paste, get_paste_titles, get_paste_titles_for_user } from "../../Queries/queries";
import RenderPaste from "./RenderPaste";

const ViewEditPaste = () =>
{
	const navigate = useNavigate();
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [isPrivate, setPrivate] = useState(false);

	const [doCreatePaste] = useMutation(create_paste, {
		onCompleted: (data) =>
		{
			navigate(`/paste/${data.createPaste.paste.id}`, { state: { returnTo: "/profile" } });
		},
		refetchQueries: [
			get_paste_titles,
			get_paste_titles_for_user,
		],
	});

	function submitPaste()
	{
		doCreatePaste({
			variables: {
				title,
				content,
				isPrivate
			}
		});
	}

	return (
		<div className="mt-5">
			<h2>Dodaj wklejkę</h2>
			<RenderPaste editable={true} title={title} content={content} setTitle={setTitle} setContent={setContent} />
			<span className="float-end d-flex flex-row align-items-baseline" style={{ gap: "10px" }} >
				<Form.Check
					type="checkbox"
					label="Prywatna"
					checked={isPrivate}
					onChange={(e) => setPrivate(e.target.checked)}
				/>
				<Button variant="primary" onClick={submitPaste}>
					Dodaj
					<FontAwesomeIcon style={{ marginLeft: "5px" }} icon={solid('floppy-disk')} />
				</Button>
			</span>
		</div>

	)

}

export default ViewEditPaste;
