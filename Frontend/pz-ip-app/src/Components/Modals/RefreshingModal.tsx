import { useMutation } from '@apollo/client';
import { Dispatch, SetStateAction, useState, } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { DocumentNode } from '@apollo/client';
interface Props
{
	mutation: DocumentNode,
	mutationArgs: any,
	refetch: () => void,
	setVisible: Dispatch<SetStateAction<boolean>>,
	isVisible: boolean,
	title: string,
	confirmText: string,
	children: any,
	onQueryCompleted?: (data: any) => void,
	onQueryError?: (error: any) => void,
}

export const RefreshingModal = ({ mutation, mutationArgs, refetch, setVisible, isVisible, title, confirmText, children }: Props) =>
{
	const [Alerts, SetAlerts] = useState("");
	const [isValid, setIsValid] = useState("");
	function validateEmail(email:any)  {
		return String(email)
		  .toLowerCase()
		  .match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		  );
	  };
	const [doMutation] = useMutation(mutation, {
		onCompleted: (data) =>
		{
			setVisible(false);
			setIsValid("");
			refetch();
		},
		onError: (error) =>
		{
			if(error.message.includes("Missing"))
			{
				setIsValid("Wszystkie pola musza zostać uzupełnione\n")
			}
			if(error.message.includes("wklejki_customuser_username_key"))
			{
				setIsValid("Nazwa użytkownika już zajęta\n")
			}
			if(error.message.includes("wklejki_customuser_email_key"))
			{
				setIsValid("Adres email jest już zajęty\n")
			}
			console.log(error)
		}
	})

	function onCancel()
	{
		setIsValid("");
		setVisible(false);
	}

	function onConfirm()
	{
		if (mutationArgs.username !== "" && mutationArgs.email !== "" && mutationArgs.password !== "" )
		{
			if(!validateEmail(mutationArgs.email)){
				setIsValid("Adres jest niepoprawny\n")
			}
			else{
				doMutation({ variables: mutationArgs });
			}

		}
		else if (mutationArgs.username === "" || mutationArgs.password === "" || mutationArgs.email === "")
		{
			setIsValid("Wszystkie pola musza zostać uzupełnione")
		}

	}

	return (
		<Modal
			show={isVisible}
			onHide={onCancel}
			backdrop="static"
			keyboard={false}
		>
			<Modal.Header closeButton>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{children}
				{isValid ==="" ? null : <div className="alert alert-danger mt-3 text-center">{isValid}</div>}
			</Modal.Body>
			<Modal.Footer>

				<Button variant="primary" onClick={onConfirm}>{confirmText}</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default RefreshingModal;
