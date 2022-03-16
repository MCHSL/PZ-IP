import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { delete_user} from "./../../Queries/queries";
import { EditUserModal } from '../Modals/EditUserModal';
import { resolveReadonlyArrayThunk } from 'graphql';

interface Props {
    id: Number,
    username: string,
    email: string,
    dateJoined: Date,
    lastLogin: any,
    isActive: boolean,
    isSuperuser: boolean,
    isStaff: boolean,
  }

const UserRow:React.FC<Props> = ({ id, username, email, dateJoined, lastLogin, isActive, isSuperuser, isStaff }) => {
  const [isVisibleEdit, setIsVisibleEdit] = useState<boolean>(false)
  const reload=()=>window.location.reload();
  function toggleModalEdit() {
    setIsVisibleEdit(!isVisibleEdit);
  }
  const [deleteUser] = useMutation(delete_user, {
    variables: {
      id: Number(id),
    },
    onCompleted: (data) => {
      console.log(data)
      console.log("deleted")
      reload()
    },
    onError: (error) => {
      console.log(error)
    }
  })
  function deleteUserFun() {
    deleteUser({variables: {id: Number(id)}})

  }
       return(
         <>
              <EditUserModal isVisibleEdit={isVisibleEdit} handleClose={toggleModalEdit} id={id} email={email} username={username} isStaff={isStaff} reload={reload}/>
              <tr className='align-middle'>
                <td>{id}</td>
                <td>{username}</td>
                <td>{email}</td>
                <td>{dateJoined}</td>
                <td>{lastLogin}</td>
                <td>{isActive ? "Tak" : "Nie"}</td>
                <td>{isSuperuser ? "Tak" : "Nie"}</td>
                <td>{isStaff ? "Tak" : "Nie"}</td>
                <td><button className='btn btn-primary' onClick={() => {toggleModalEdit()}} >Edytuj</button></td>
                <td><button className='btn btn-danger' onClick={() => {deleteUserFun()}}>Usuń</button></td>
              </tr>
              </>
       );
   };

   export default UserRow;