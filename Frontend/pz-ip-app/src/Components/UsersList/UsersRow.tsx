import React from 'react';
import { useMutation } from '@apollo/client';
import { delete_user} from "./../../Queries/queries";

interface Props {
    id: Number,
    username: String,
    email: String,
    dateJoined: any,
    lastLogin: any,
    isActive: Boolean,
    isSuperuser: Boolean,
    isStaff: Boolean,
    isVisibleEdit: Boolean,
    handleClose: () => void,
  }

const UserRow:React.FC<Props> = ({ id, username, email, dateJoined, lastLogin, isActive, isSuperuser, isStaff, isVisibleEdit, handleClose }) => {
  const [deleteUser] = useMutation(delete_user, {
    variables: {
      email: email,
    },
    onCompleted: (data) => {
      console.log(data)
      console.log("deleted")
    },
    onError: (error) => {
      console.log(error)
    }
  })
       return(
              <tr className='align-middle'>
                <td>{id}</td>
                <td>{username}</td>
                <td>{email}</td>
                <td>{dateJoined}</td>
                <td>{lastLogin}</td>
                <td>{isActive ? "Tak" : "Nie"}</td>
                <td>{isSuperuser ? "Tak" : "Nie"}</td>
                <td>{isStaff ? "Tak" : "Nie"}</td>
                <td><button className='btn btn-primary' onClick={() => {handleClose()}} >Edytuj</button></td>
                <td><button className='btn btn-danger' onClick={() => {deleteUser({variables: {email: email}})}}>Usuń</button></td>
              </tr>
       );
   };

   export default UserRow;