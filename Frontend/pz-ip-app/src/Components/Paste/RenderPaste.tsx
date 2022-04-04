import { Form, Dropdown } from "react-bootstrap";
import { Attachment } from "./Types";
import Attachments from "./Attachments/Attachments";
import { useState } from "react";
import ExpirationTime from "./ExpirationTime/ExpirationTime";

interface Props {
  title: string;
  content: string;
  editable: boolean;
  attachments: Attachment[];
  expDate: number;

  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setAttachments: (attachments: Attachment[]) => void;
  setExpDate: (expDate: number) => void;
}
const RenderPaste = ({
  title,
  content,
  attachments,
  editable,
  expDate,
  setTitle,
  setContent,
  setAttachments,
  setExpDate,
}: Props) => {
  {
    console.log(expDate);
  }
  return (
    <Form className="mt-3">
      <Form.Group className="mb-3">
        <label className="mb-1">Tytuł</label>
        <Form.Control
          type="text"
          readOnly={!editable}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <label className="mb-1">Zawartość</label>
        <Form.Control
          as="textarea"
          readOnly={!editable}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <label className="mb-1">Pliki</label>
        <Attachments {...{ editable, attachments, setAttachments }} />
      </Form.Group>
      {editable && (
        <Form.Group className="mb-3">
          <label className="mb-1">Czas wygaśnięcia</label>
          <ExpirationTime expDate={expDate} setExpDate={setExpDate} />
        </Form.Group>
      )}
    </Form>
  );
};

export default RenderPaste;
