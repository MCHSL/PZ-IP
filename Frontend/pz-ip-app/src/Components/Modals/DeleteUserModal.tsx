import { Dispatch, SetStateAction, useState } from 'react';
import { delete_user } from "./../../Queries/queries";
import RefreshingModal from "./RefreshingModal";

interface Props
{
	id: Number
	username: string

	isVisible: boolean
	setVisible: Dispatch<SetStateAction<boolean>>
	refetch: () => void
};

export const DeleteUserModal = ({ id, username, ...rest }: Props) =>
{
	const [error, setError] = useState("");

	function onError(error: any)
	{
		setError(error.message);
	}

	const props = {
		title: "Usuń użytkownika",
		confirmText: "Usuń",
		mutation: delete_user,
		mutationArgs: { id: Number(id) },
		onError,
		onClosed: () => setError(""),
		validate: () => true,
		...rest,
	}


	return (
		<RefreshingModal {...props}>
			<div className="text-center">
				<h3>Czy na pewno chcesz usunąć użytkownika <b>{username}</b>?</h3>
				{error && <div className="alert alert-danger mt-3 text-center">{error}</div>}
			</div>
		</RefreshingModal>
	);
};
