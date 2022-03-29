import { Dispatch, SetStateAction, useState } from 'react';
import { create_user } from "./../../Queries/queries";
import RefreshingModal from "./RefreshingModal";

interface Props
{
	isVisible: boolean
	setVisible: Dispatch<SetStateAction<boolean>>
	refetch: () => void
};

export const CreateUserModal = ({ isVisible, setVisible, refetch }: Props) =>
{
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");


	return (
		<RefreshingModal
			isVisible={isVisible}
			setVisible={setVisible}
			refetch={refetch}
			title="Utwórz użytkownika"
			confirmText="Utwórz"
			mutation={create_user}
			mutationArgs={{ email: email, password: password, username: username }}
		>
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
		</RefreshingModal>
	);
};
