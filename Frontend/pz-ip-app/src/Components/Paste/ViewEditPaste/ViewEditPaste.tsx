import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useUser } from "../../Context/CurrentUserContext";
import RenderPaste from "../RenderPaste";
import { useLocation, useNavigate } from "react-router-dom";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Rate from "../../Rating/Rate";
import { LocationState } from "../Types";
import { DeletePasteModal } from "../../Modals/DeletePasteModal";
import client from "../../../ApolloConfig";
import ReportPasteModal from "../../Modals/ReportPasteModal";
import { usePaste } from "../../Context/CurrentPasteContext";

interface Props {
  id: number;
}

const ViewEditPaste = ({ id }: Props) => {
  const { paste, setPaste, savePaste, refetchPaste, updatePaste } = usePaste();

  const [isEditing, setIsEditing] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);
  const [error, setError] = useState("");
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setPaste(id);
  }, [setPaste, id]);

  useEffect(() => {
    return () => {
      setPaste(null);
    };
  }, [setPaste]);

  function validate() {
    if (paste.expireDate !== null && paste.expireDate < new Date()) {
      setError("Data wygaśnięcia nie może poprzedzać daty obecnej");
      return false;
    } else if (paste.title === "" || paste.content === "") {
      setError("Wszystkie pola muszą być uzupełnione");
      return false;
    }
    setError("");
    return true;
  }

  function editOrSave() {
    if (isEditing) {
      if (!validate()) {
        return;
      }
      savePaste().then(() => {
        setIsEditing(false);
      });
    } else {
      setIsEditing(true);
    }
  }

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
        pasteTitle={paste.title}
        refetch={() => Promise.resolve()}
        isVisible={deleteVisible}
        setVisible={setDeleteVisible}
        afterSubmit={yeetAway}
      />
      <ReportPasteModal
        id={id}
        isVisible={reportVisible}
        setVisible={setReportVisible}
        onSubmit={refetchPaste}
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
                  disabled={paste.isReported}
                >
                  {paste.isReported ? "Zgłoszona" : "Zgłoś"}
                  <FontAwesomeIcon
                    style={{ marginLeft: "5px" }}
                    icon={solid("exclamation-triangle")}
                  />
                </Button>
              )}
              <Rate
                key={paste.likeCount}
                id={id}
                disabled={!user}
                pasteLikes={paste.likeCount}
                liking={paste.isLiked}
              />
            </>
          )}
        </div>
      </div>
      {error === "" ? null : (
        <div className="alert alert-danger mt-3 text-center">{error}</div>
      )}
      <RenderPaste editable={isEditing} />
      {paste.author.id === user?.id ? (
        <>
          <Form.Check
            className="mt-3"
            type="checkbox"
            label="Prywatna"
            checked={paste.isPrivate}
            onChange={(e) => updatePaste({ isPrivate: e.target.checked })}
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
