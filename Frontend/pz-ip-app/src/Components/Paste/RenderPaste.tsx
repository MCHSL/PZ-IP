import { Form } from "react-bootstrap";

interface Props {
  title: string;
  content: string;
  editable: boolean;

  setTitle: (title: string) => void;
  setContent: (content: string) => void;
}

const RenderPaste = ({
  title,
  content,
  editable,
  setTitle,
  setContent,
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
        <label className="mb-1">Opis</label>
        <Form.Control
          as="textarea"
          readOnly={!editable}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
      </Form.Group>
    </Form>
  );
};

export default RenderPaste;
