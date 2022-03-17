import React, { useState } from 'react';
import { EditUserModal } from '../Modals/EditUserModal';
import { DeleteUserModal } from '../Modals/DeleteUserModal';

interface Props
{
	id: Number,
	username: string,
	email: string,
	dateJoined: Date,
	lastLogin: any,
	isActive: boolean,
	isSuperuser: boolean,
	isStaff: boolean,
	refetch: () => void,
}

const UserRow: React.FC<Props> = ({ id, username, email, dateJoined, lastLogin, isActive, isSuperuser, isStaff, refetch }) =>
{
	const [isEditVisible, setEditVisible] = useState<boolean>(false)
	const [isDeleteVisible, setDeleteVisible] = useState<boolean>(false);
	return (
		<>
			<EditUserModal id={id} email={email} username={username} isStaff={isStaff} isVisible={isEditVisible} setVisible={setEditVisible} refetch={refetch} />
			<DeleteUserModal id={id} username={username} isVisible={isDeleteVisible} setVisible={setDeleteVisible} refetch={refetch} />

			<tr className='align-middle'>
				<td>{id}</td>
				<td>{username}</td>
				<td>{email}</td>
				<td>{dateJoined}</td>
				<td>{isActive ? "Tak" : "Nie"}</td>
				<td>{isSuperuser ? "Tak" : "Nie"}</td>
				<td>{isStaff ? "Tak" : "Nie"}</td>
				<td><button className='btn btn-primary' onClick={() => { setEditVisible(true) }} >Edytuj</button></td>
				<td><button className='btn btn-danger' onClick={() => { setDeleteVisible(true) }}>Usuń</button></td>
			</tr>
		</>
	);
};

export default UserRow;
