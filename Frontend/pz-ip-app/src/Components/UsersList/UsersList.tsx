import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { User } from "./../../Types/Types";
import { getUsers } from "./../../Queries/queries";
import UserRow from "./UsersRow";

const UserList = () => {
  const [user, setUser]=useState<any>();
  useQuery(getUsers, {
    variables: {
    },
    onCompleted: (data) => {
      setUser(data)
      console.log(data)
    },
    onError: (error) => {
      console.log(error)
    }
  })
     return(
        <div>
        <h4 className="text-center p-2">
            Lista użytkowników
        </h4>
        <table className="table table-sm table-striped">
            <thead>
            <tr>
                <th>ID</th>
                <th>Nazwa użytkownika</th>
                <th>Email</th>
                <th>Data dołączenia</th>
                <th>Data ostatniego logowania</th>
                <th>Aktywny</th>
                <th>isSuperUser</th>
                <th>isStaff</th>
            </tr>
            </thead>
            <tbody>
                {user ? user.users.map((element:any) =>(
                <UserRow key={element.id} id={element.id} username={element.username}
                email={element.email} dateJoined={element.dateJoined} lastLogin={element.lastLogin}
                isActive={element.isActive}  isSuperUser={element.isSuperUser} isStaff={element.isStaff}/>
                )) : console.log("wczytywanie")}
            </tbody>
        </table>
        </div>
     );
 };
 export default UserList;
