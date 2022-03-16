import { useMutation } from '@apollo/client';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { update_user } from "./../../Queries/queries";
interface Props {
    id: Number,
    isVisibleEdit: boolean,
    handleClose: () => void,
    email: string,
    username: string,
    isStaff: boolean,
    reload: () => void,
};

export const EditUserModal = ({ isVisibleEdit, handleClose, id, email, username, isStaff, reload }: Props) => {
  const[newEmail, setNewEmail] = useState(email)
  const[newUsername, setNewUsername] = useState(username)
  const[newIsStaff, setNewIsStaff] = useState(isStaff)
  const [updateUser] = useMutation(update_user, {
    variables: {
      id: Number(id),
      email: email,
      username: username,
      isStaff: isStaff,
    },
    onCompleted: (data) => {
      console.log(data)
      console.log("deleted")
    },
    onError: (error) => {
      console.log(error)
    }
  })
  function closeModal() {
    updateUser({variables: {email: email, id: Number(id), username: username, isStaff: isStaff}})
    reload()
  }
    return(
        <Modal
        show={isVisibleEdit}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edytuj użytkownika</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="form-group mt-3">
          <label htmlFor="exampleInputEmail1">Email</label>
          <input type="email" className="form-control" value={newEmail} onChange={(e) => {setNewEmail(e.target.value)}} />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="exampleInputPassword1">Nazwa użytkownika</label>
          <input type="name" className="form-control" value={newUsername} onChange={(e) => {setNewUsername(e.target.value)}} />
        </div>
        <div className="form-check mt-3">
            <input className="form-check-input" type="checkbox" checked={newIsStaff} id="flexCheckDefault" onChange={() => {setNewIsStaff(!newIsStaff)}} />
            <label className="form-check-label" htmlFor="flexCheckDefault">
                isStaff
            </label>
        </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={()=>{closeModal()}}>Zapisz</Button>
        </Modal.Footer>
      </Modal>
      );
};
