import React, { SetStateAction, useState, Dispatch } from 'react';
import { update_user } from "./../../Queries/queries";
import RefreshingModal from "./RefreshingModal";

interface Props
{
	id: Number,
	email: string,
	username: string,
	isStaff: boolean,

	isVisible: boolean
	setVisible: Dispatch<SetStateAction<boolean>>
	refetch: () => void
};

export const EditUserModal = ({ isVisible, setVisible, refetch, id, email, username, isStaff }: Props) =>
{
	const [newEmail, setNewEmail] = useState(email)
	const [newUsername, setNewUsername] = useState(username)
	const [newIsStaff, setNewIsStaff] = useState(isStaff)

	return (
		<RefreshingModal
			mutation={update_user}
			mutationArgs={{ id: Number(id), email: newEmail, username: newUsername, isStaff: newIsStaff }}
			title="Edytuj Użytkownika"
			confirmText="Zapisz"

			isVisible={isVisible}
			setVisible={setVisible}
			refetch={refetch}
		>
			<div className="form-group mt-3">
				<label htmlFor="exampleInputEmail1">Email</label>
				<input type="email" className="form-control" value={newEmail} onChange={(e) => { setNewEmail(e.target.value) }} />
			</div>
			<div className="form-group mt-3">
				<label htmlFor="exampleInputPassword1">Nazwa użytkownika</label>
				<input type="name" className="form-control" value={newUsername} onChange={(e) => { setNewUsername(e.target.value) }} />
			</div>
			<div className="form-check mt-3">
				<input className="form-check-input" type="checkbox" checked={newIsStaff} id="flexCheckDefault" onChange={() => { setNewIsStaff(!newIsStaff) }} />
				<label className="form-check-label" htmlFor="flexCheckDefault">
					isStaff
				</label>
			</div>
		</RefreshingModal>

	);
};
