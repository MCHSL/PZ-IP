import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import {
  get_paste,
  get_paste_titles,
  get_paste_titles_for_user,
  update_paste,
} from "../../Queries/queries";
import { useUser } from "../Context/CurrentUserContext";
import RenderPaste from "./RenderPaste";
import { useLocation, useNavigate } from "react-router-dom";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  id: Number;
}

interface State {
  returnTo: string;
}

const ViewEditPaste = ({ id }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [pasteTitle, setPasteTitle] = useState("");
  const [pasteContent, setPasteContent] = useState("");
  const [pasteAuthor, setPasteAuthor] = useState<any>();
  const [pasteIsPrivate, setPasteIsPrivate] = useState(false);
  const [error, setError] = useState("");
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [doUpdatePaste] = useMutation(update_paste, {
    onCompleted: () => {
      setIsEditing(false);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  function validate() {
    if (pasteTitle !== "" && pasteContent !== "") {
      setError("");
      return true;
    } else if (pasteTitle === "" || pasteContent === "") {
      setError("Wszystkie pola muszą być uzupełnione");
      return false;
    }
    setError("Nieznany błąd");
    return false;
  }

  function editOrSave() {
    if (isEditing) {
      if (!validate()) {
        return;
      }
      doUpdatePaste({
        variables: {
          id: id,
          title: pasteTitle,
          content: pasteContent,
          isPrivate: pasteIsPrivate,
        },
        refetchQueries: [
          get_paste,
          get_paste_titles,
          get_paste_titles_for_user,
        ],
      });
    } else {
      setIsEditing(true);
    }
  }

  useQuery(get_paste, {
    variables: { id },
    onCompleted: (data) => {
      setPasteTitle(data.paste.title);
      setPasteContent(data.paste.content);
      setPasteAuthor(data.paste.author);
      setPasteIsPrivate(data.paste.isPrivate);
    },
  });

  const returnLoc = location.state
    ? (location.state as State).returnTo
    : "/profile";

  return (
    <>
      <Button
        className=" mt-5"
        variant="primary"
        onClick={() => {
          navigate(returnLoc);
        }}
      >
        <FontAwesomeIcon
          style={{ marginRight: "5px" }}
          icon={solid("arrow-left")}
        />
        Powrót
      </Button>
      {error === "" ? null : (
        <div className="alert alert-danger mt-3 text-center">{error}</div>
      )}
      <RenderPaste
        editable={isEditing}
        title={pasteTitle}
        content={pasteContent}
        setTitle={setPasteTitle}
        setContent={setPasteContent}
      />
      <Form.Check
        type="checkbox"
        label="Prywatna"
        checked={pasteIsPrivate}
        onChange={(e) => setPasteIsPrivate(e.target.checked)}
        disabled={!isEditing}
      />
      {pasteAuthor?.id === user?.id ? (
        <span
          className="float-end d-flex flex-row align-items-baseline"
          style={{ gap: "10px" }}
        >
          <Button className="float-end" variant="primary" onClick={editOrSave}>
            {isEditing ? (
              <span>
                Zapisz
                <FontAwesomeIcon
                  style={{ marginLeft: "5px" }}
                  icon={solid("floppy-disk")}
                />
              </span>
            ) : (
              <span>
                Edytuj
                <FontAwesomeIcon
                  style={{ marginLeft: "5px" }}
                  icon={solid("pen-to-square")}
                />
              </span>
            )}
          </Button>
        </span>
      ) : null}
    </>
  );
};

export default ViewEditPaste;
