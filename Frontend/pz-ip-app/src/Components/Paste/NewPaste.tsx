import { useMutation } from "@apollo/client";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  create_paste,
  get_paste_metadata,
  get_paste_metadata_for_user,
} from "../../Queries/queries";
import { Attachment } from "./Types";
import RenderPaste from "./RenderPaste";

const NewPaste = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [expireDate, setexpireDate] = useState<any>(null);
  const [error, setError] = useState("");

  const [doCreatePaste] = useMutation(create_paste, {
    onCompleted: (data) => {
      navigate(`/paste/${data.createPaste.paste.id}`, {
        state: { returnTo: "/profile" },
      });
    },
    onError: (error) => {
      setError(error.message);
    },
    refetchQueries: [get_paste_metadata, get_paste_metadata_for_user],
  });

  function validate() {
    let date = Date.now();
    if (expireDate === -1) {
      setError("Wybierz swoją datę lub wybierz prefiniowaną");
      return false;
    } else if (expireDate < date && expireDate !== null) {
      setError("Data wygaśnięcia nie może poprzedzać daty obecnej");
      return false;
    } else if (title !== "" && content !== "") {
      setError("");
      return true;
    } else if (title === "" || content === "") {
      setError("Wszystkie pola muszą być uzupełnione");
      return false;
    }
    setError("Nieznany błąd");
    return false;
  }

  function submitPaste() {
    if (validate()) {
      doCreatePaste({
        variables: {
          title,
          content,
          isPrivate,
          expireDate: expireDate,
          fileDelta: {
            added: attachments
              .filter((a) => a.is_added)
              .map((a) => {
                return { name: a.name, content: a.content };
              }),
            removed: attachments
              .filter((a) => a.is_removed)
              .map((a) => {
                return { id: a.id };
              }),
          },
        },
      });
    }
  }

  return (
    <>
      <div className="mt-5">
        <h2>Dodaj wklejkę</h2>
        {error === "" ? null : (
          <div className="alert alert-danger mt-3 text-center">{error}</div>
        )}
        <RenderPaste
          editable={true}
          title={title}
          content={content}
          attachments={attachments}
          expireDate={expireDate}
          reports={[]}
          refetch={() => Promise.resolve()}
          setTitle={setTitle}
          setContent={setContent}
          setAttachments={setAttachments}
          setexpireDate={setexpireDate}
        />
        <Form.Check
          className="mt-3"
          type="checkbox"
          label="Prywatna"
          checked={isPrivate}
          onChange={(e) => setIsPrivate(e.target.checked)}
        />
        <span
          className="float-end d-flex flex-row align-items-baseline"
          style={{ gap: "10px" }}
        >
          <Button variant="primary mt-2" onClick={submitPaste}>
            Dodaj
            <FontAwesomeIcon
              style={{ marginLeft: "5px" }}
              icon={solid("floppy-disk")}
            />
          </Button>
        </span>
      </div>
    </>
  );
};

export default NewPaste;
