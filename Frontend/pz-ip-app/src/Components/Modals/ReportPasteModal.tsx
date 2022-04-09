import { useMutation } from "@apollo/client";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import {
  get_paste,
  get_unreviewed_reports,
  get_unreviewed_reports_count,
  report_paste,
} from "../../Queries/queries";

interface Props {
  id: number;
  setVisible: (bruh: boolean) => void;
  isVisible: boolean;
  onSubmit: () => void;
}

export const RefreshingModal = ({
  id,
  setVisible,
  isVisible,
  onSubmit,
}: Props) => {
  const [reason, setReason] = useState("");

  const [doReport] = useMutation(report_paste, {
    variables: {
      id,
      reason,
    },
    onCompleted: (data) => {
      setVisible(false);
      onSubmit();
    },
    refetchQueries: [get_unreviewed_reports, get_unreviewed_reports_count],
  });

  function onCancel() {
    setVisible(false);
  }

  function onConfirm() {
    doReport();
  }

  return (
    <Modal
      show={isVisible}
      onHide={onCancel}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Raportowanie</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          type="text"
          className="form-control"
          placeholder="Powód zgłoszenia"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onConfirm}>
          Wyślij
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RefreshingModal;
