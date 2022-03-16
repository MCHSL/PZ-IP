import { useMutation } from '@apollo/client';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { create_user } from "./../../Queries/queries";
interface Props {
    isVisible: boolean,
    handleClose: () => void,
    reload: () => void,
};

export const CreateUserModal = ({ isVisible, handleClose, reload }: Props) => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [setUser] = useMutation(create_user, {
      variables: {
        email: email,
        username: username,
        password: password,
      },
      onCompleted: (data) => {
        console.log(data)
        console.log("done")
        reload()
      },
      onError: (error) => {
        console.log(error)
      }
    })
    function closeModal() {
      setUser({variables: {email: email, password: password, username: username}})
    }
    return(
        <Modal
        show={isVisible}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Dodaj użytkownika</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="form-group mt-3">
          <label htmlFor="exampleInputEmail1">Email</label>
          <input type="email" className="form-control" placeholder="jan.kowalski@wp.pl" onChange={(e) => setEmail(e.target.value)} required/>
        </div>
        <div className="form-group mt-3">
          <label htmlFor="exampleInputPassword1">Nazwa użytkownika</label>
          <input type="name" className="form-control" placeholder="jan_k" onChange={(e) => setUsername(e.target.value)} required/>
        </div>
        <div className="form-group mt-3">
          <label htmlFor="exampleInputPassword1">Hasło</label>
          <input type="password" className="form-control" placeholder="******" onChange={(e) => setPassword(e.target.value)} required/>
        </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => {closeModal()}}>Dodaj</Button>
        </Modal.Footer>
      </Modal>
      );
};