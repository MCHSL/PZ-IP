import { useMutation } from "@apollo/client";
import { useState } from "react"
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { create_paste } from "../../Queries/queries";
import CurrentUser from "../UsersList/CurrentUser";
import RenderPaste from "./RenderPaste";

const ViewEditPaste = () =>
{
	const navigate = useNavigate();
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	const [doCreatePaste] = useMutation(create_paste, {
		onCompleted: (data) =>
		{
			navigate(`/paste/${data.createPaste.paste.id}`);
		}
	});

	function submitPaste()
	{
		doCreatePaste({
			variables: {
				title,
				content,
			}
		});
	}

	return (
		<div className="mt-5">
			<h2>Dodaj wklejkę</h2>
			<RenderPaste editable={true} title={title} content={content} setTitle={setTitle} setContent={setContent} />
			<Button className="float-end" variant="primary" onClick={submitPaste}>
				Dodaj
			</Button>
		</div>

	)

}

export default ViewEditPaste;
