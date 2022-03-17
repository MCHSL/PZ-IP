
import { useQuery } from "@apollo/client";
import { get_current_user } from "./../Queries/queries";
import { useNavigate } from "react-router-dom";
import { useApolloClient } from "@apollo/client";

const CurrentUser = () =>
{
	const client = useApolloClient();
	const navigate = useNavigate();
	const { loading, error, data } = useQuery(get_current_user, {
		onCompleted: (data) =>
		{
			console.log(data);
		},
		onError: (error) =>
		{
			console.log(error);
		},
	});

	function logout()
	{
		localStorage.removeItem("token");
		client.cache.reset()
		navigate("/login");
	}

	if (loading)
	{
		return <div>Ładowanie profilu...</div>;
	}

	if (error)
	{
		return <div>Błąd pobierania profilu</div>;
	}

	return (
		<div>
			<span className="mt-1 h4 align-middle">
				Witaj, {data.me.username} 👋
			</span>
			<button className="btn btn-danger mt-1" onClick={logout}>
				Wyloguj
			</button>
		</div>
	);
};

export default CurrentUser;
