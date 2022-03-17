import { useState } from "react";
import { useQuery } from "@apollo/client";
import { get_users } from "./../../Queries/queries";
import UserRow from "./UsersRow";
import { CreateUserModal } from "../Modals/CreateUserModal";
import CurrentUser from "../CurrentUser";

const UserList = () =>
{
	const [isCreateVisible, setCreateVisible] = useState<boolean>(false);
	const { loading, error, data, refetch } = useQuery(get_users, {
		onCompleted: (data) =>
		{
			console.log(data);
		},
		onError: (error) =>
		{
			console.log(error);
		},
	});

	return (
		<div className="container">
			<CreateUserModal
				isVisible={isCreateVisible}
				setVisible={setCreateVisible}
				refetch={refetch}
			/>
			<button
				className="btn btn-success float-end m-2"
				onClick={() =>
				{
					setCreateVisible(true);
				}}
			>
				Dodaj użytkownika
			</button>
			<CurrentUser />
			<h4 className="text-center p-2">Lista użytkowników</h4>
			<table className="table table-sm table-striped">
				<thead>
					<tr>
						<th>ID</th>
						<th>Nazwa użytkownika</th>
						<th>Email</th>
						<th>Data dołączenia</th>
						<th>Data ostatniego logowania</th>
						<th>Aktywny</th>
						<th>isSuperUser</th>
						<th>isStaff</th>
						<th></th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{loading || error
						? null
						: data.users.map((element: any) => (
							<UserRow
								key={element.id}
								id={element.id}
								username={element.username}
								email={element.email}
								dateJoined={element.dateJoined}
								lastLogin={element.lastLogin}
								isActive={element.isActive}
								isSuperuser={element.isSuperuser}
								isStaff={element.isStaff}
								refetch={refetch}
							/>
						))}
				</tbody>
			</table>
			{loading ? (
				<div className="text-center">
					<h3>Ładowando...</h3>
				</div>
			) : null}
			{error ? (
				<div className="text-center">
					<h3>Wystąpił błąd podczas pobierania zasobów</h3>
				</div>
			) : null}
		</div>
	);
};

export default UserList;
