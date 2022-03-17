import { Dispatch, SetStateAction } from 'react';
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

export const DeleteUserModal = ({ id, username, isVisible, setVisible, refetch }: Props) =>
{

	return (
		<RefreshingModal
			isVisible={isVisible}
			setVisible={setVisible}
			refetch={refetch}
			title="Usuń użytkownika"
			confirmText="You know it"
			mutation={delete_user}
			mutationArgs={{ id: Number(id) }}
		>
			<div className="text-center">
				<h3>Czy na pewno chcesz usunąć użytkownika <b>{username}</b>?</h3>
			</div>
		</RefreshingModal>
	);
};
