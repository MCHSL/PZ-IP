import { useState } from "react";
import { reset_password } from "../../Queries/queries";
import { useMutation } from "@apollo/client";
import { Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const PasswordReset = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");

  const [doReset, { loading }] = useMutation(reset_password, {
    onCompleted: () => {
      navigate("/login");
    },
    onError: (error) => {
      console.log(error);
      if (error.message === "Invalid token") {
        setError("Link wygasł lub został już użyty.");
      }
    },
  });

  function submit() {
    if (password !== password2) {
      return;
    }
    doReset({ variables: { token, password } });
  }

  return (
    <div className="container col-3 mt-5">
      <h2 className="text-center p-2">Resetowanie hasła</h2>
      <div className="form-group mt-3">
        <label>Nowe hasło:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          className="form-control"
          placeholder="Wprowadź hasło"
        />
      </div>
      <div className="form-group mt-3">
        <label>Powtórz nowe hasło:</label>
        <input
          type="password"
          value={password2}
          onChange={(e) => {
            setPassword2(e.target.value);
          }}
          className={
            "form-control " + (password !== password2 ? "is-invalid" : "")
          }
          placeholder="Powtórz hasło"
        />
      </div>
      {error ? (
        <div className="alert alert-danger mt-3 text-center">{error}</div>
      ) : null}
      {loading ? (
        <div className="form-group mt-5 justify-content-center text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <div className="form-group mt-3">
          <button
            type="submit"
            className="btn btn-primary mt-3 col-12"
            onClick={submit}
          >
            Zapisz
          </button>
        </div>
      )}
    </div>
  );
};

export default PasswordReset;
