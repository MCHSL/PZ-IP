import { Form } from "react-bootstrap";
import Attachments from "./Attachments/Attachments";
import ExpirationTime from "./ExpirationTime/ExpirationTime";
import Reports from "./Reports/Reports";
import { DateTime } from "luxon";
import { usePaste } from "../Context/CurrentPasteContext";

interface Props {
  editable: boolean;
  setEditable?: (editable: boolean) => void;
}

const RenderPaste = ({ editable, setEditable }: Props) => {
  const { pasteLoading, pasteError, paste, refetchPaste, updatePaste } =
    usePaste();
  console.log("paste", paste);
  if (!paste) {
    return null;
  }

  const formattedExpiration = DateTime.fromJSDate(
    new Date(paste.expireDate ? paste.expireDate : new Date())
  ).toFormat("yyyy-MM-dd HH:mm");

  return (
    <Form className="mt-3">
      <Reports />
      <Form.Group className="mb-3">
        <label className="mb-1">Tytuł</label>
        <Form.Control
          type="text"
          readOnly={!editable}
          value={paste.title}
          onChange={(e) => {
            updatePaste({ title: e.target.value });
          }}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <label className="mb-1">Zawartość</label>
        <Form.Control
          as="textarea"
          readOnly={!editable}
          value={paste.content}
          onChange={(e) => {
            updatePaste({ content: e.target.value });
          }}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <label className="mb-1">Pliki</label>
        <Attachments editable={editable} />
      </Form.Group>
      {editable && (
        <Form.Group className="mb-3">
          <label className="mb-1">Czas wygaśnięcia</label>
          <ExpirationTime />
        </Form.Group>
      )}
      {!editable && (
        <Form.Group className="mb-3">
          <label className="mb-1">
            Czas wygaśnięcia:{" "}
            {paste.expireDate == null ? "Nigdy" : formattedExpiration}
          </label>
        </Form.Group>
      )}
    </Form>
  );
};

export default RenderPaste;
