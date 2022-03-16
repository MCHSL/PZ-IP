import { useMutation } from '@apollo/client';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { create_user } from "./../../Queries/queries";
interface Props {
    isVisibleEdit: boolean,
    handleClose: () => void,
    email: String,
    username: String
};

export const EditUserModal = ({ isVisibleEdit, handleClose, email, username }: Props) => {
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
          <input type="email" className="form-control" placeholder="jan.kowalski@wp.pl"/>
        </div>
        <div className="form-group mt-3">
          <label htmlFor="exampleInputPassword1">Nazwa użytkownika</label>
          <input type="name" className="form-control" placeholder="jan_k"/>
        </div>
        <div className="form-check mt-3">
            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
            <label className="form-check-label" htmlFor="flexCheckDefault">
                isStaff
            </label>
        </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary">Zapisz</Button>
        </Modal.Footer>
      </Modal>
      );
};
