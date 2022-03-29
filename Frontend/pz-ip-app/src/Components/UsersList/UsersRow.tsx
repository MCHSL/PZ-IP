import React, { useState } from "react";
import { EditUserModal } from "../Modals/EditUserModal";
import { DeleteUserModal } from "../Modals/DeleteUserModal";
import { DateTime } from "luxon";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

interface Props {
  id: Number;
  username: string;
  email: string;
  dateJoined: Date;
  isActive: boolean;
  isSuperuser: boolean;
  isStaff: boolean;
  refetch: () => void;
}

const UserRow: React.FC<Props> = ({
  id,
  username,
  email,
  dateJoined,
  isActive,
  isSuperuser,
  isStaff,
  refetch,
}) => {
  const [isEditVisible, setEditVisible] = useState<boolean>(false);
  const [isDeleteVisible, setDeleteVisible] = useState<boolean>(false);

  const formattedDateJoined = DateTime.fromJSDate(
    new Date(dateJoined)
  ).toFormat("yyyy-MM-dd HH:mm");

  return (
    <>
      <EditUserModal
        id={id}
        email={email}
        username={username}
        isStaff={isStaff}
        isVisible={isEditVisible}
        setVisible={setEditVisible}
        refetch={refetch}
      />
      <DeleteUserModal
        id={id}
        username={username}
        isVisible={isDeleteVisible}
        setVisible={setDeleteVisible}
        refetch={refetch}
      />

      <tr className="align-middle">
        <td>{id}</td>
        <td>{username}</td>
        <td>{email}</td>
        <td>{formattedDateJoined}</td>
        <td>{isActive ? "Tak" : "Nie"}</td>
        <td>{isSuperuser ? "Tak" : "Nie"}</td>
        <td>{isStaff ? "Tak" : "Nie"}</td>
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
