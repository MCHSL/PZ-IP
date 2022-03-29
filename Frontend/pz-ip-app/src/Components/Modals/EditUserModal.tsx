import React, { SetStateAction, useState, Dispatch } from 'react';
import { update_user } from "./../../Queries/queries";
import RefreshingModal from "./RefreshingModal";
import validateEmail from './Shared';

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

export const EditUserModal = ({  id, email, username, isStaff, ...rest }: Props) =>
{
	const [newEmail, setNewEmail] = useState(email)
	const [newUsername, setNewUsername] = useState(username)
	const [newIsStaff, setNewIsStaff] = useState(isStaff)

	const [error, setError] = useState("")

	function validate() {
		if (newUsername !== "" && newEmail !== "")
		{
			if(validateEmail(newEmail)) {
				return true;
			}
			else {
				setError("Adres jest niepoprawny\n");
				return false;
			}
		}
		else if (newUsername === "" || newEmail === "")
		{
			setError("Wszystkie pola musza zostać uzupełnione");
			return false;
		}
		return false;
	}

	function onError(error: any) {
		setError(error.message);
		// temporary
		if(error.message.includes("Missing"))
		{
			setError("Wszystkie pola musza zostać uzupełnione\n")
		}
		if(error.message.includes("wklejki_customuser_username_key"))
		{
			setError("Nazwa użytkownika już zajęta\n")
		}
		if(error.message.includes("wklejki_customuser_email_key"))
		{
			setError("Adres email jest już zajęty\n")
		}
	}

	function onClosed() {
		setError("");
		setNewEmail(email);
		setNewUsername(username);
		setNewIsStaff(isStaff);
	}

	const props = {
		mutation: update_user,
		mutationArgs: { id: Number(id), email: newEmail, username: newUsername, isStaff: newIsStaff },
		title: "Edytuj Użytkownika",
		confirmText: "Zapisz",
		validate,
		onError,
		onClosed,
		...rest
	}

	return (
		<RefreshingModal {...props}>
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
			{error && <div className="alert alert-danger mt-3 text-center">{error}</div>}
		</RefreshingModal>

	);
};
