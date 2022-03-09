import React from 'react';

interface Props {
    id: Number,
    username: String,
    email: String,
    dateJoined: any,
    lastLogin: any,
    isActive: Boolean,
    isSuperUser: Boolean,
    isStaff: Boolean,

  }

const UserRow:React.FC<Props> = ({ id, username, email, dateJoined, lastLogin, isActive, isSuperUser, isStaff }) => {
  // {console.log(id)}
       return(
              <tr>
                <td>{id}</td>
                <td>{username}</td>
                <td>{email}</td>
                <td>{dateJoined}</td>
                <td>{lastLogin}</td>
                <td>{isActive ? "Tak" : "Nie"}</td>
                <td>{isSuperUser ? "Tak" : "Nie"}</td>
                <td>{isStaff ? "Tak" : "Nie"}</td>
              </tr>
       );
   };

   export default UserRow;