import { Form } from "react-bootstrap";
import { Attachment, Report } from "./Types";
import Attachments from "./Attachments/Attachments";
import ExpirationTime from "./ExpirationTime/ExpirationTime";
import Reports from "./Reports/Reports";

interface Props {
  title: string;
  content: string;
  editable: boolean;
  reports: Report[];
  attachments: Attachment[];
  expDate: {};

  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setAttachments: (attachments: Attachment[]) => void;
  setExpDate: (expDate: {}) => void;
  refetch: () => Promise<any>;
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

  ...rest
}: Props) => {
  return (
    <Form className="mt-3">
      <Reports {...rest} />
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
      {!editable && (
        <Form.Group className="mb-3">
          <label className="mb-1">
            Czas wygaśnięcia: {expDate == null ? "Nigdy" : "expDate"}
          </label>
        </Form.Group>
      )}
    </Form>
  );
};

export default RenderPaste;
