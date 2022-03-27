import { useState } from 'react';
import { login } from "./../../Queries/queries";
import { useMutation } from '@apollo/client';
import { useNavigate } from "react-router-dom";
import { useUser } from '../Context/CurrentUserContext';
import { Spinner } from 'react-bootstrap';


interface Props
{
	setRegistering: () => void;
}

const LoginForm = ({ setRegistering }: Props) =>
{
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const { userLoading, refetchUser } = useUser();

	const [doLogin, { loading }] = useMutation(login, {
		onCompleted: (data) =>
		{
			localStorage.setItem("token", data.tokenAuth.token)
			refetchUser();
			navigate("/profile");
		},
		onError: (error) =>
		{
			setError(error.message);
		}
	});

	function submit()
	{
		setError("");
		doLogin({ variables: { email, password } });
	}

	return (
		<>
			<h2 className="text-center p-2">Logowanie</h2>
			<div className="form-group mt-3">
				<label>Email</label>
				<input type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} className="form-control" placeholder="Wprowadź email" />
			</div>
			<div className="form-group mt-3">
				<label>Hasło</label>
				<input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} className="form-control" placeholder="Wprowadź hasło" />
			</div>
			{error ? <div className="alert alert-danger mt-3 text-center">{error}</div> : null}
			{(userLoading || loading) ?
				<div className='form-group mt-5 justify-content-center text-center'><Spinner animation="border" /></div>
				:
				<div className='form-group mt-3'>
					<button type="submit" className="btn btn-primary mt-3 col-12" onClick={submit}>Zaloguj</button>
					<button type="submit" className="btn btn-secondary mt-3 col-12" onClick={setRegistering}>Rejestracja</button>
				</div>
			}
		</>);
}

export default LoginForm;
