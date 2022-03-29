import { useMutation } from "@apollo/client";
import { Dispatch, SetStateAction, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { DocumentNode } from "@apollo/client";

interface Props {
  mutation: DocumentNode;
  mutationArgs: any;
  refetch: () => void;
  validate: () => boolean;
  onError: (error: any) => void;
  onClosed: () => void;
  setVisible: Dispatch<SetStateAction<boolean>>;
  isVisible: boolean;
  title: string;
  confirmText: string;
  children: any;
}

export interface RefreshingModalProps {
  isVisible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  refetch: () => void;
}

export const RefreshingModal = ({
  mutation,
  mutationArgs,
  refetch,
  setVisible,
  isVisible,
  title,
  confirmText,
  children,
  validate,
  onError,
  onClosed,
}: Props) => {
  const [Alerts, SetAlerts] = useState("");

  const [doMutation] = useMutation(mutation, {
    onCompleted: (data) => {
      setVisible(false);
      refetch();
    },
    onError,
  });

  function onCancel() {
    setVisible(false);
    onClosed();
  }

  function onConfirm() {
    if (validate()) {
      doMutation({ variables: mutationArgs });
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
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onConfirm}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RefreshingModal;

/*if(error.message.includes("Missing"))
			{
				setError("Wszystkie pola musza zostać uzupełnione\n")
			}
			if(error.message.includes("wklejki_customuser_username_key"))
			{
				setError("Nazwa użytkownika już zajęta\n")
			}
			if(error.message.includes("wklejki_customuser_email_key"))
			{
				setError("Adres email jest już zajęty\n")
			}*/
/*{error ==="" ? null : <div className="alert alert-danger mt-3 text-center">{error}</div>}*/
