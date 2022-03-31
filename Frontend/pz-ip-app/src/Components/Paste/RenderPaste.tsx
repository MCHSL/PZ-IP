import { Form } from "react-bootstrap";
import { Attachment } from "./Types";
import Attachments from "./Attachments/Attachments";

interface Props {
  title: string;
  content: string;
  editable: boolean;
  attachments: Attachment[];

  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setAttachments: (attachments: Attachment[]) => void;
}

const RenderPaste = ({
  title,
  content,
  attachments,
  editable,
  setTitle,
  setContent,
  setAttachments,
}: Props) => {
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
      <Form.Group>
        <label className="mb-1">Pliki</label>
        <Attachments {...{ editable, attachments, setAttachments }} />
      </Form.Group>
    </Form>
  );
};

export default RenderPaste;
