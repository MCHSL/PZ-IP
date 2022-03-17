import { useState } from "react";
import { useMutation } from "@apollo/client";
import { create_user } from "./../../Queries/queries";

interface Props
{
	setLoggingIn: () => void;
}

const LoginForm = ({ setLoggingIn }: Props) =>
{
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const [doRegister] = useMutation(create_user, {
		onCompleted: (data) =>
		{
			setLoggingIn();
		},
		onError: (error) =>
		{
			console.log(error);
		},
	});

	return (
		<>
			<h2 className="text-center p-2">Rejestracja</h2>
			<div className="form-group mt-3">
				<label htmlFor="exampleInputEmail1">Email:</label>
				<input
					type="email"
					value={email}
					onChange={(e) =>
					{
						setEmail(e.target.value);
					}}
					className="form-control"
					placeholder="Wprowadź email"
				/>
			</div>
			<div className="form-group mt-3">
				<label htmlFor="exampleInputEmail1">Nazwa użytkownika:</label>
				<input
					type="email"
					value={username}
					onChange={(e) =>
					{
						setUsername(e.target.value);
					}}
					className="form-control"
					placeholder="Wprowadź nazwę użytkownika "
				/>
			</div>
			<div className="form-group mt-3">
				<label htmlFor="exampleInputPassword1">Hasło:</label>
				<input
					type="password"
					value={password}
					onChange={(e) =>
					{
						setPassword(e.target.value);
					}}
					className="form-control"
					placeholder="Wprowadź hasło użytkownika"
				/>
			</div>
			<div className="form-group mt-3">
				<button
					type="submit"
					className="btn btn-primary mt-3 col-12"
					onClick={() =>
						doRegister({ variables: { email, username, password } })
					}
				>
					Zarejestruj
				</button>
				<button
					type="submit"
					className="btn btn-secondary mt-3 col-12"
					onClick={setLoggingIn}
				>
					Powrót do logowania
				</button>
			</div>
		</>
	);
};

export default LoginForm;
