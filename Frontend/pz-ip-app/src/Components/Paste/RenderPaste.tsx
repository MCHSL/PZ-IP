import { Form, ListGroup } from "react-bootstrap";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Attachment } from "./Types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { humanFileSize } from "../Misc/Utils";

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
  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file: File) => {
        const reader = new FileReader();

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = () => {
          let content = reader.result as string;
          content = content?.slice(content.indexOf(",") + 1);
          setAttachments([
            ...attachments,
            {
              name: file.name,
              content,
              is_added: true,
              size: file.size,
              id: -attachments.length, // not a real ID, just something to make it unique
            },
          ]);
        };
        reader.readAsDataURL(file);
      });
    },
    [attachments, setAttachments]
  );

  function removeAddedAttachment(id: number) {
    setAttachments(attachments.filter((a) => !(a.id === id && a.is_added)));
  }

  function unmarkFromRemoval(id: number) {
    setAttachments(
      attachments.map((a) =>
        a.id === id && a.is_removed ? { ...a, is_removed: false } : a
      )
    );
  }

  function markForRemoval(id: number) {
    setAttachments(
      attachments.map((a) => (a.id === id ? { ...a, is_removed: true } : a))
    );
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const border = isDragActive ? "5px dashed #ced4da" : "1px dashed #ced4da";

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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "30px",
            padding: "10px",
            border: "1px solid #ced4da",
            borderRadius: "0.25rem",
            height: "20vh",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", flexGrow: "3" }}>
            <ListGroup
              style={{
                width: "100%",
                height: "100%",
                overflow: "auto",
                border: "1px solid #ced4da",
                borderRadius: ".25rem",
              }}
              variant="flush"
            >
              {attachments.map((att) => {
                return att.is_added ? (
                  <ListGroup.Item variant="success" key={att.id?.toString()}>
                    {editable && (
                      <span
                        onClick={() => removeAddedAttachment(att.id as number)}
                        style={{
                          cursor: "pointer",
                          marginRight: "5px",
                          verticalAlign: "baseline",
                        }}
                      >
                        <FontAwesomeIcon icon={solid("xmark")} size="lg" />
                      </span>
                    )}
                    <span style={{ verticalAlign: "baseline" }}>
                      {att.name}
                    </span>
                    <span
                      style={{ verticalAlign: "baseline", float: "right" }}
                      className="text-muted"
                    >
                      {humanFileSize(att.size ?? 0)}
                    </span>
                  </ListGroup.Item>
                ) : att.is_removed ? (
                  <ListGroup.Item variant="danger" key={att.id?.toString()}>
                    {editable && (
                      <span
                        onClick={() => unmarkFromRemoval(att.id as number)}
                        style={{
                          cursor: "pointer",
                          marginRight: "5px",
                          verticalAlign: "baseline",
                        }}
                      >
                        <FontAwesomeIcon icon={solid("xmark")} size="lg" />
                      </span>
                    )}
                    <span style={{ verticalAlign: "baseline" }}>
                      {att.name}
                    </span>
                    <span
                      style={{ verticalAlign: "baseline", float: "right" }}
                      className="text-muted"
                    >
                      {humanFileSize(att.size ?? 0)}
                    </span>
                  </ListGroup.Item>
                ) : (
                  <ListGroup.Item key={att.id?.toString()}>
                    {editable ? (
                      <>
                        <span
                          onClick={() => markForRemoval(att.id as number)}
                          style={{
                            cursor: "pointer",
                            marginRight: "5px",
                            verticalAlign: "baseline",
                          }}
                        >
                          <FontAwesomeIcon icon={solid("xmark")} size="lg" />
                        </span>
                        <span style={{ verticalAlign: "baseline" }}>
                          {att.name}
                        </span>
                      </>
                    ) : (
                      <a
                        style={{ verticalAlign: "text-baseline" }}
                        href={att.url}
                      >
                        {att.name}
                      </a>
                    )}
                    <span
                      style={{ verticalAlign: "baseline", float: "right" }}
                      className="text-muted"
                    >
                      {humanFileSize(att.size ?? 0)}
                    </span>
                  </ListGroup.Item>
                );
              })}
              <ListGroup.Item key="yeet" />
            </ListGroup>
          </div>
          {editable && (
            <div
              {...getRootProps()}
              style={{
                outline: border,
                borderRadius: ".25rem",
                textAlign: "center",
                display: "flex",
              }}
            >
              <div
                style={{
                  margin: "auto",
                  padding: "1vh",
                }}
                className="text-muted"
              >
                <input {...getInputProps()} />
                <div>Przeciągnij pliki lub kliknij, aby wybrać</div>
                <div>Max. 5 MB</div>
              </div>
            </div>
          )}
        </div>
      </Form.Group>
    </Form>
  );
};

export default RenderPaste;
