import { Dispatch, SetStateAction } from 'react';
import { delete_paste } from "../../Queries/queries";
import RefreshingModal from "./RefreshingModal";

interface Props
{
	id: Number
	title: string
	isVisible: boolean
	setVisible: Dispatch<SetStateAction<boolean>>
	refetch: () => void
};

export const DeletePasteModal = ({ id, title, isVisible, setVisible, refetch }: Props) =>
{

	return (
		<RefreshingModal
			isVisible={isVisible}
			setVisible={setVisible}
			refetch={refetch}
			title="Usuń wklejkę"
			confirmText="Usuń"
			mutation={delete_paste}
			mutationArgs={{ id: Number(id) }}
		>
			<div className="text-center">
				<h3>Czy na pewno chcesz usunąć wklejkę <b>{title}</b>?</h3>
			</div>
		</RefreshingModal>
	);
};
