import { Form } from "react-bootstrap";
import { Attachment, Report } from "./Types";
import Attachments from "./Attachments/Attachments";
import ExpirationTime from "./ExpirationTime/ExpirationTime";
import Reports from "./Reports/Reports";
import { DateTime } from "luxon";

interface Props {
  title: string;
  content: string;
  editable: boolean;
  reports: Report[];
  attachments: Attachment[];
  expireDate: Date;

  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setAttachments: (attachments: Attachment[]) => void;
  setexpireDate: (expireDate: {}) => void;
  refetch: () => Promise<any>;
}
const RenderPaste = ({
  title,
  content,
  attachments,
  editable,
  expireDate,
  setTitle,
  setContent,
  setAttachments,
  setexpireDate,

  ...rest
}: Props) => {
  const formattedExpiration = DateTime.fromJSDate(
    new Date(expireDate)
  ).toFormat("yyyy-MM-dd HH:mm");

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
          <ExpirationTime
            expireDate={expireDate}
            setexpireDate={setexpireDate}
          />
        </Form.Group>
      )}
      {!editable && (
        <Form.Group className="mb-3">
          <label className="mb-1">
            Czas wygaśnięcia:{" "}
            {expireDate == null ? "Nigdy" : formattedExpiration}
          </label>
        </Form.Group>
      )}
    </Form>
  );
};

export default RenderPaste;
