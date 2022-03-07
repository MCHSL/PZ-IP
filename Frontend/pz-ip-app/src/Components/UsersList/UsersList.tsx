import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { User } from "./../../Types/Types";
import { getUsers } from "./../../Queries/queries";
const UserList = () => {
  const [user, setUser]=useState<User>();
  useQuery(getUsers, {
    variables: {
    },
    onCompleted: (data) => {
      setUser(data)
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
            </tr>
            </thead>
            <tbody>

            </tbody>
        </table>
        </div>
     );
 };
 export default UserList;
