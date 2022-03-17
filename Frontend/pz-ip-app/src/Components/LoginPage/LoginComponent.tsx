import { useState } from 'react';
import { login } from "./../../Queries/queries";
import { useMutation } from '@apollo/client';
import { useNavigate } from "react-router-dom";


interface Props
{
	setRegistering: () => void;
}

const LoginForm = ({ setRegistering }: Props) =>
{
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [doLogin] = useMutation(login, {
		onCompleted: (data) =>
		{
			localStorage.setItem("token", data.tokenAuth.token)
			navigate("/")
		},
		onError: (error) =>
		{
			console.log(error)
		}
	});

	return (<>
		<h2 className="text-center p-2">Logowanie</h2>
		<div className="form-group mt-3">
			<label htmlFor="exampleInputEmail1">Email</label>
			<input type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} className="form-control" placeholder="Wprowadź email" />
		</div>
		<div className="form-group mt-3">
			<label htmlFor="exampleInputPassword1">Hasło</label>
			<input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} className="form-control" placeholder="Wprowadź hasło" />
		</div>
		<div className='form-group mt-3'>
			<button type="submit" className="btn btn-primary mt-3 col-12" onClick={() => doLogin({ variables: { email, password } })}>Zaloguj</button>
			<button type="submit" className="btn btn-secondary mt-3 col-12" onClick={setRegistering}>Rejestracja</button>
		</div>
	</>);
}

export default LoginForm;