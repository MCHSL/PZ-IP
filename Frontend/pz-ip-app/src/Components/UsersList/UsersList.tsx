import { useState } from "react";
import UserRow from "./UsersRow";
import { CreateUserModal } from "../Modals/CreateUserModal";
import PaginableList from "../List/PaginatingList";
import { getUsersPaginated } from "../../Queries/PaginatingQuery";
import { withStaff } from "../Misc/LoginRequired";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { User } from "../../Types/Types";

const UserList = () => {
  console.log("loading users list");

  const [isCreateVisible, setCreateVisible] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const {
    previousData,
    data = previousData,
    refetch,
  } = getUsersPaginated(page, itemsPerPage);

  return (
    <div className="container">
      <CreateUserModal
        isVisible={isCreateVisible}
        setVisible={setCreateVisible}
        refetch={refetch}
      />
      <button
        className="btn btn-success float-end m-2"
        onClick={() => {
          setCreateVisible(true);
        }}
      >
        Dodaj użytkownika
        <FontAwesomeIcon
          style={{ marginLeft: "5px" }}
          icon={solid("user-plus")}
        />
      </button>
      <PaginableList
        visible={data}
        totalItems={data?.userCount}
        page={page}
        setPage={setPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
      >
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
            {data?.users.map((user: User) => (
              <UserRow key={user.id.toString()} user={user} refetch={refetch} />
            ))}
          </tbody>
        </table>
      </PaginableList>
    </div>
  );
};

export default withStaff(UserList);
