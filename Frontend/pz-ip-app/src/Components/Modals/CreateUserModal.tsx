import { Dispatch, SetStateAction, useState } from 'react';
import { create_user } from "./../../Queries/queries";
import RefreshingModal from "./RefreshingModal";
import validateEmail from './Shared';

interface Props
{
	isVisible: boolean
	setVisible: Dispatch<SetStateAction<boolean>>
	refetch: () => void
};

export const CreateUserModal = (props: Props) =>
{
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const [error, setError] = useState("");

	function validate() {
		if (username !== "" && email !== "" && password !== "" )
		{
			if(validateEmail(email)) {
				return true;
			}
			else {
				setError("Adres jest niepoprawny\n");
				return false;
			}
		}
		else if (username === "" || password === "" || email === "")
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
			setError("Wszystkie pola muszą zostać uzupełnione\n")
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
		setEmail("");
		setUsername("");
		setPassword("");
	}

	const modalProps = {
		validate,
		onError,
		onClosed,
		title: "Utwórz użytkownika",
		confirmText: "Utwórz",
		mutation: create_user,
		mutationArgs: { email, password, username },
		...props,
	}

	return (
		<RefreshingModal {...modalProps} >
			<div className="form-group mt-3">
				<label htmlFor="exampleInputEmail1">Email</label>
				<input type="email" className="form-control" placeholder="jan.kowalski@wp.pl" onChange={(e) => setEmail(e.target.value)} required />

			</div>
			<div className="form-group mt-3">
				<label htmlFor="exampleInputPassword1">Nazwa użytkownika</label>
				<input type="name" className="form-control" placeholder="jan_k" onChange={(e) => setUsername(e.target.value)} required />
			</div>
			<div className="form-group mt-3">
				<label htmlFor="exampleInputPassword1">Hasło</label>
				<input type="password" className="form-control" placeholder="**************" onChange={(e) => setPassword(e.target.value)} required />
			</div>
			{error && <div className="alert alert-danger mt-3 text-center" role="alert">{error}</div>}
		</RefreshingModal>
	);
};
