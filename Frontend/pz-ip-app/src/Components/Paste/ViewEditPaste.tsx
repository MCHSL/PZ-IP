import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import {
  get_paste,
  get_paste_metadata,
  get_paste_metadata_for_user,
  update_paste,
} from "../../Queries/queries";
import { useUser } from "../Context/CurrentUserContext";
import RenderPaste from "./RenderPaste";
import { useLocation, useNavigate } from "react-router-dom";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Rate from "../Rating/Rate";
import { Attachment, LocationState } from "./Types";
import { DeletePasteModal } from "../Modals/DeletePasteModal";
import client from "../../ApolloConfig";
import ReportPasteModal from "../Modals/ReportPasteModal";

interface Props {
  id: number;
}

const ViewEditPaste = ({ id }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [pasteTitle, setPasteTitle] = useState("");
  const [pasteContent, setPasteContent] = useState("");
  const [pasteAuthor, setPasteAuthor] = useState<any>();
  const [pasteIsPrivate, setPasteIsPrivate] = useState(false);
  const [pasteAttachments, setPasteAttachments] = useState<Attachment[]>([]);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);
  const [expireDate, setexpireDate] = useState<any>(null);
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

  // function validate() {
  //   if (expireDate < 0) {
  //     if (expireDate === -1) {
  //       setError("Wybierz swoją datę lub wybierz prefiniowaną");
  //       return false;
  //     }
  //     setError("Data wygaśnięcia nie może poprzedzać daty obecnej");
  //     return false;
  //   } else if (pasteTitle !== "" && pasteContent !== "") {
  //     setError("");
  //     return true;
  //   } else if (pasteTitle === "" || pasteContent === "") {
  //     setError("Wszystkie pola muszą być uzupełnione");
  //     return false;
  //   }
  //   setError("Nieznany błąd");
  //   return false;
  // }

  function validate() {
    let date = Date.now();
    if (expireDate === -1) {
      setError("Wybierz swoją datę lub wybierz prefiniowaną");
      return false;
    } else if (expireDate < date && expireDate !== null) {
      setError("Data wygaśnięcia nie może poprzedzać daty obecnej");
      return false;
    } else if (pasteTitle !== "" && pasteContent !== "") {
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
      const fileDelta = {
        added: pasteAttachments
          .filter((a) => a.is_added)
          .map((a) => {
            return { name: a.name, content: a.content };
          }),
        removed: pasteAttachments
          .filter((a) => a.is_removed)
          .map((a) => {
            return { id: a.id };
          }),
      };
      setPasteAttachments(
        pasteAttachments
          .filter((a) => !a.is_removed)
          .map((a) => ({ ...a, is_added: false }))
      );
      doUpdatePaste({
        variables: {
          id,
          title: pasteTitle,
          content: pasteContent,
          isPrivate: pasteIsPrivate,
          expireDate: expireDate,
          fileDelta,
        },
        refetchQueries: [
          get_paste,
          get_paste_metadata,
          get_paste_metadata_for_user,
        ],
      });
    } else {
      setIsEditing(true);
    }
  }

  const { data, refetch } = useQuery(get_paste, {
    variables: { id },
    onCompleted: (cdata) => {
      setPasteTitle(cdata.paste.title);
      setPasteContent(cdata.paste.content);
      setPasteAuthor(cdata.paste.author);
      setPasteIsPrivate(cdata.paste.isPrivate);
      setPasteAttachments(cdata.paste.attachments ?? []);
      setexpireDate(cdata.paste.expireDate);
    },
  });

  const returnLoc = location.state
    ? (location.state as LocationState).returnTo
    : "/profile";

  function yeetAway() {
    const normalizedId = client.cache.identify({ id, __typename: "PasteType" });
    client.cache.evict({ id: normalizedId });
    client.cache.gc();
    navigate(returnLoc, { state: location.state });
  }

  return (
    <>
      <DeletePasteModal
        id={id}
        pasteTitle={pasteTitle}
        isVisible={deleteVisible}
        setVisible={setDeleteVisible}
        refetch={refetch}
        afterSubmit={yeetAway}
      />
      <ReportPasteModal
        id={id}
        isVisible={reportVisible}
        setVisible={setReportVisible}
        onSubmit={refetch}
      />
      <div style={{ display: "flex" }} className="mt-5">
        <Button
          variant="primary"
          onClick={() => {
            navigate(returnLoc, { state: location.state });
          }}
        >
          <FontAwesomeIcon
            style={{ marginRight: "5px" }}
            icon={solid("arrow-left")}
          />
          Powrót
        </Button>
        <div style={{ marginLeft: "auto", gap: "10px", display: "flex" }}>
          {user && (isEditing || user.isStaff) && (
            <Button variant="danger" onClick={() => setDeleteVisible(true)}>
              Usuń
              <FontAwesomeIcon
                style={{ marginLeft: "5px" }}
                icon={solid("trash")}
              />
            </Button>
          )}
          {!isEditing && (
            <>
              {user && (
                <Button
                  variant="danger"
                  onClick={() => setReportVisible(true)}
                  disabled={data?.paste?.isReported}
                >
                  {data?.paste?.isReported ? "Zgłoszona" : "Zgłoś"}
                  <FontAwesomeIcon
                    style={{ marginLeft: "5px" }}
                    icon={solid("exclamation-triangle")}
                  />
                </Button>
              )}
              <Rate
                key={data ? data.paste.likeCount : 0}
                id={id}
                disabled={!user}
                pasteLikes={data ? data.paste.likeCount : 0}
                liking={data ? data.paste.isLiked : false}
              />
            </>
          )}
        </div>
      </div>
      {error === "" ? null : (
        <div className="alert alert-danger mt-3 text-center">{error}</div>
      )}
      <RenderPaste
        // WTF?
        editable={isEditing}
        title={pasteTitle}
        content={pasteContent}
        attachments={pasteAttachments}
        expireDate={expireDate}
        reports={data?.paste?.reports || []}
        refetch={refetch}
        setTitle={setPasteTitle}
        setContent={setPasteContent}
        setAttachments={setPasteAttachments}
        setexpireDate={setexpireDate}
      />
      {pasteAuthor?.id === user?.id ? (
        <>
          <Form.Check
            className="mt-3"
            type="checkbox"
            label="Prywatna"
            checked={pasteIsPrivate}
            onChange={(e) => setPasteIsPrivate(e.target.checked)}
            disabled={!isEditing}
          />
          <span
            className="float-end d-flex flex-row align-items-baseline"
            style={{ gap: "10px" }}
          >
            <Button
              className="float-end"
              variant="primary"
              onClick={editOrSave}
            >
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
        </>
      ) : null}
    </>
  );
};

export default ViewEditPaste;
