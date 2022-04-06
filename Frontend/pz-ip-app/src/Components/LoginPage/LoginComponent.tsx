import { useState } from "react";
import { login } from "./../../Queries/queries";
import { useMutation } from "@apollo/client";
import { useUser } from "../Context/CurrentUserContext";
import { Spinner } from "react-bootstrap";

interface Props {
  setRegistering: () => void;
}

const LoginForm = ({ setRegistering }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState("");
  const { refetchUser } = useUser();
  const [loggingIn, setLoggingIn] = useState(false);

  const [doLogin] = useMutation(login, {
    onCompleted: (data) => {
      localStorage.setItem("tokenExpiresIn", data.tokenAuth.payload.exp);
      refetchUser().then(() => setLoggingIn(false));
    },
    onError: (error) => {
      setLoggingIn(false);
      if (error.message.includes("Please")) {
        setIsValid("Podaj poprawne dane logowania\n");
      }
      console.log(error);
    },
  });

  function submit() {
    setIsValid("");
    setLoggingIn(true);
    doLogin({ variables: { email, password } });
  }

  return (
    <>
      <h2 className="text-center p-2">Logowanie</h2>
      <div className="form-group mt-3">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          className="form-control"
          placeholder="Wprowadź email"
        />
      </div>
      <div className="form-group mt-3">
        <label>Hasło</label>
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
      {isValid !== "" ? (
        <div className="alert alert-danger mt-3 text-center">{isValid}</div>
      ) : null}
      {loggingIn ? (
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
            Zaloguj
          </button>
          <button
            type="submit"
            className="btn btn-secondary mt-3 col-12"
            onClick={setRegistering}
          >
            Rejestracja
          </button>
        </div>
      )}
    </>
  );
};

export default LoginForm;
