import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { User } from "./../../Types/Types";
import { get_users } from "./../../Queries/queries";
import UserRow from "./UsersRow";
import { CreateUserModal } from '../Modals/CreateUserModal';
import { EditUserModal } from '../Modals/EditUserModal';
import CurrentUser from '../CurrentUser';
import AllowedMessage from '../Alerting/AllowedMessage';

const UserList = () => {
  const [users, setUsers]=useState<any>();
  const [allowed, setAllowed] = useState<boolean>(true);
  const [isVisibleCreate, setIsVisibleCreate] = useState<boolean>(false)
  const reload=()=>window.location.reload();
  function toggleModalCreate() {
    setIsVisibleCreate(!isVisibleCreate);
  }
  useQuery(get_users, {
    variables: {
    },
    onCompleted: (data) => {
      setAllowed(true);
      setUsers(data)
      console.log(data)
    },
    onError: (error) => {
      setAllowed(false);
      console.log(error)
    }
  })
     return(
      <div className='container'>
      <CreateUserModal isVisible={isVisibleCreate} handleClose={toggleModalCreate} reload={reload}/>
      <button className='btn btn-success float-end m-2' onClick={()=>{setIsVisibleCreate(true)}}>Dodaj użytkownika</button>
      <CurrentUser />
        { allowed ?
          <><h4 className="text-center p-2">
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
                  <th></th>
                  <th></th>
              </tr>
              </thead>
              <tbody>
                  {users ? users.users.map((element:any) =>(
                  <UserRow key={element.id} id={element.id} username={element.username}
                  email={element.email} dateJoined={element.dateJoined} lastLogin={element.lastLogin}
                  isActive={element.isActive}  isSuperuser={element.isSuperuser} isStaff={element.isStaff}/>
                  )) : null}
              </tbody>
          </table></> :
          <AllowedMessage/>}
        </div>
     );
 };
 export default UserList;
function True(True: any) {
  throw new Error('Function not implemented.');
}

function setStateAction<T>(arg0: boolean): [any, any] {
  throw new Error('Function not implemented.');
}

