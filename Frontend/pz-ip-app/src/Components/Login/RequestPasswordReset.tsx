import { useState } from "react";
import { request_password_reset, reset_password } from "../../Queries/queries";
import { useMutation } from "@apollo/client";
import { Spinner } from "react-bootstrap";

type Message = {
  message: string;
  class: string;
};

const RequestPasswordReset = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<Message | null>(null);

  const [doRequestReset, { loading }] = useMutation(request_password_reset, {
    onCompleted: () => {
      setMsg({
        message:
          "Link do resetowania hasła został wysłany na podany adres email.",
        class: "alert-success",
      });
    },
    onError: (error) => {
      console.log(error);
      setMsg({
        message: "Coś poszło nie tak, spróbuj ponownie.",
        class: "alert-danger",
      });
    },
  });

  function submit() {
    doRequestReset({ variables: { email } });
  }

  return (
    <div className="container col-3 mt-5">
      <h2 className="text-center p-2">Resetowanie hasła</h2>
      <div className="form-group mt-3">
        <label>Adres e-mail użyty podczas rejestracji:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          className="form-control"
          placeholder="Podaj adres email"
        />
      </div>
      {msg ? (
        <div className={"alert mt-3 text-center " + msg.class}>
          {msg.message}
        </div>
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
            Wyślij link
          </button>
        </div>
      )}
    </div>
  );
};

export default RequestPasswordReset;
