import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react"
import { Button } from "react-bootstrap";
import { get_paste, update_paste } from "../../Queries/queries";
import { useUser } from "../Context/CurrentUserContext";
import CurrentUser from "../UsersList/CurrentUser";
import RenderPaste from "./RenderPaste";
import { useNavigate } from "react-router-dom";

interface Props
{
	id: Number
	returnTo: string
}

const ViewEditPaste = ({ id, returnTo }: Props) =>
{
	const [isEditing, setIsEditing] = useState(false);
	const [pasteTitle, setPasteTitle] = useState("");
	const [pasteContent, setPasteContent] = useState("");
	const [pasteAuthor, setPasteAuthor] = useState<any>();
	const { user } = useUser();
	const navigate = useNavigate();

	const [doUpdatePaste] = useMutation(update_paste, {
		onCompleted: () =>
		{
			setIsEditing(false);
		}
	});

	function editOrSave()
	{
		if (isEditing)
		{
			doUpdatePaste({
				variables: {
					id: id,
					title: pasteTitle,
					content: pasteContent
				},
				update: (cache) =>
				{
					const normalizedId = cache.identify({ id, __typename: 'PasteType' });
					cache.evict({ id: normalizedId });
					cache.gc();
				}
			}
			);
		}
		else
		{
			setIsEditing(true);
		}
	}

	useQuery(get_paste, {
		variables: { id },
		onCompleted: (data) =>
		{
			setPasteTitle(data.paste.title);
			setPasteContent(data.paste.content);
			setPasteAuthor(data.paste.author);
		}
	})

	return (
		<>
			<Button className=" mt-5" variant="primary" onClick={() => {navigate(returnTo)}}>
				{returnTo === "/profile" ? "Powrót do profilu" : "Powrót do listy"}
			</Button>
			<RenderPaste editable={isEditing} title={pasteTitle} content={pasteContent} setTitle={setPasteTitle} setContent={setPasteContent} />
			{pasteAuthor?.id === user?.id ? <Button className="float-end" variant="primary" onClick={editOrSave}>
				{isEditing ? "Zapisz" : "Edytuj"}
			</Button> : null}
		</>

	)

}

export default ViewEditPaste;
