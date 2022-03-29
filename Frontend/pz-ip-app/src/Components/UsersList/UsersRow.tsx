import { useState } from "react";
import { EditUserModal } from "../Modals/EditUserModal";
import { DeleteUserModal } from "../Modals/DeleteUserModal";
import { DateTime } from "luxon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { User } from "../../Types/Types";

interface Props {
  user: User;
  refetch: () => void;
}

const UserRow = ({ user, refetch }: Props) => {
  const [isEditVisible, setEditVisible] = useState<boolean>(false);
  const [isDeleteVisible, setDeleteVisible] = useState<boolean>(false);

  const formattedDateJoined = DateTime.fromJSDate(
    new Date(user.dateJoined)
  ).toFormat("yyyy-MM-dd HH:mm");

  return (
    <>
      <EditUserModal
        {...user}
        isVisible={isEditVisible}
        setVisible={setEditVisible}
        refetch={refetch}
      />
      <DeleteUserModal
        {...user}
        isVisible={isDeleteVisible}
        setVisible={setDeleteVisible}
        refetch={refetch}
      />

      <tr className="align-middle">
        <td>{user.id}</td>
        <td>{user.username}</td>
        <td>{user.email}</td>
        <td>{formattedDateJoined}</td>
        <td>{user.isActive ? "Tak" : "Nie"}</td>
        <td>{user.isSuperuser ? "Tak" : "Nie"}</td>
        <td>{user.isStaff ? "Tak" : "Nie"}</td>
        <td>
          <button
            className="btn btn-info"
            onClick={() => {
              setEditVisible(true);
            }}
          >
            Edytuj
            <FontAwesomeIcon
              style={{ marginLeft: "5px" }}
              icon={solid("pen-to-square")}
            />
          </button>
        </td>
        <td>
          <button
            className="btn btn-danger"
            onClick={() => {
              setDeleteVisible(true);
            }}
          >
            Usuń
            <FontAwesomeIcon
              style={{ marginLeft: "5px" }}
              icon={solid("trash-can")}
            />
          </button>
        </td>
      </tr>
    </>
  );
};

export default UserRow;
