import { createRef, useCallback, useEffect, useRef } from "react";
import { ListGroup } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { Attachment } from "../Types";
import { AttachmentRow } from "./AttachmentRow";

interface Props {
  editable: boolean;
  attachments: Attachment[];
  setAttachments: (attachments: Attachment[]) => void;
}

export const Attachments = ({
  editable,
  attachments,
  setAttachments,
}: Props) => {
  const scrolled = useRef(true);

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
              is_removed: false,
              size: file.size,
              id: -attachments.length, // not a real ID, just something to make it unique
              url: "",
            },
          ]);
          scrolled.current = false;
        };
        reader.readAsDataURL(file);
      });
    },
    [attachments, setAttachments]
  );

  const AttListRef = createRef<HTMLDivElement>();

  useEffect(() => {
    if (AttListRef.current && !scrolled.current) {
      scrolled.current = true;
      AttListRef.current.scrollTop = AttListRef.current.scrollHeight;
    }
  });

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
  const border = isDragActive ? "3px dashed #ced4da" : "1px dashed #ced4da";

  return (
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
          ref={AttListRef}
        >
          {attachments.map((attachment) => {
            return (
              <AttachmentRow
                {...{
                  attachment,
                  editable,
                  removeAddedAttachment,
                  unmarkFromRemoval,
                  markForRemoval,
                }}
              />
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
  );
};

export default Attachments;
