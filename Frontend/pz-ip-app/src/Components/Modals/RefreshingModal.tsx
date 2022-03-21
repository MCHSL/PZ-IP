import { useMutation } from '@apollo/client';
import { Dispatch, SetStateAction, } from 'react';
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
	const [doMutation] = useMutation(mutation, {
		onCompleted: (data) =>
		{
			setVisible(false);
			refetch();
		},
		onError: (error) =>
		{
			console.log(error)
		}
	})

	function onCancel()
	{
		setVisible(false);
	}

	function onConfirm()
	{
		doMutation({ variables: mutationArgs });
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
			</Modal.Body>
			<Modal.Footer>
				<Button variant="primary" onClick={onConfirm}>{confirmText}</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default RefreshingModal;
