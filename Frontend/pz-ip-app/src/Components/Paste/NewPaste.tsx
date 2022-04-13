import { selectHttpOptionsAndBodyInternal, useMutation } from "@apollo/client";
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
import RenderPaste from "./RenderPaste";
import { usePaste } from "../Context/CurrentPasteContext";
import { useEffect } from "react";

const NewPaste = () => {
  const { paste, updatePaste, savePaste, setPaste } = usePaste();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    setPaste(-1);
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

  function submitPaste() {
    if (validate()) {
      savePaste().then(({ data }) => {
        console.log(data);
        navigate("/paste/" + data.createPaste.paste.id.toString());
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
        <RenderPaste editable={true} />
        <Form.Check
          className="mt-3"
          type="checkbox"
          label="Prywatna"
          checked={paste.isPrivate}
          onChange={(e) => updatePaste({ isPrivate: e.target.checked })}
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
