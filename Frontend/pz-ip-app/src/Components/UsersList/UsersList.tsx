import { useState } from "react";
import { useQuery } from "@apollo/client";
import { get_users } from "./../../Queries/queries";
import UserRow from "./UsersRow";
import { CreateUserModal } from "../Modals/CreateUserModal";
import CurrentUser from "./CurrentUser";
import PaginableList from "../List/PaginatingList";
import { getUsersPaginated } from "../../Queries/PaginatingQuery";
import { withStaff } from "../Misc/LoginRequired";

const UserList = () =>
{
	console.log("loading users list");

	const [isCreateVisible, setCreateVisible] = useState<boolean>(false);
	const [page, setPage] = useState<number>(0);
	const [itemsPerPage, setItemsPerPage] = useState<number>(10);

	const { loading, error, previousData, data = previousData, refetch } = getUsersPaginated(page, itemsPerPage);

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
			<PaginableList visible={data} totalItems={data?.userCount} page={page} setPage={setPage} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage}>
				<h2 className="text-center p-2 mt-4">Lista użytkowników</h2>
				<table className="table table-sm table-striped mt-3">
					<thead>
						<tr>
							<th>ID</th>
							<th>Nazwa użytkownika</th>
							<th>Email</th>
							<th>Data dołączenia</th>
							<th>Aktywny</th>
							<th>isSuperUser</th>
							<th>isStaff</th>
							<th></th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{data?.users.map((element: any) => (
							<UserRow
								key={element.id}
								id={element.id}
								username={element.username}
								email={element.email}
								dateJoined={element.dateJoined}
								isActive={element.isActive}
								isSuperuser={element.isSuperuser}
								isStaff={element.isStaff}
								refetch={refetch}
							/>
						))}
					</tbody>
				</table>
			</PaginableList>
		</div>
	);
};

export default withStaff(UserList);
