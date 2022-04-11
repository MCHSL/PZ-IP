import React, { useState } from "react";
import { Dropdown, Form } from "react-bootstrap";

interface Props {
  expireDate: any;
  setexpireDate: (title: any) => void;
}

const ExpirationTime = ({ expireDate, setexpireDate }: Props) => {
  const [expireDateText, setexpireDateText] = useState("Nigdy");
  let now = new Date();
  function setCustomData(e: string) {
    let data = new Date(e);
    setexpireDate(data);
  }
  function handleDate(e: any, text: string) {
    let data = new Date(e);
    setexpireDateText(text);
    setexpireDate(data);
  }
  return (
    <div className="row">
      <Dropdown className="col-6">
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          {expireDateText}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item
            onClick={() => {
              setexpireDateText("Nigdy");
              setexpireDate(null);
            }}
          >
            Nigdy
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              handleDate(
                now.setTime(now.getTime() + 1 * 60 * 60 * 1000),
                "1 godzina"
              );
            }}
          >
            1 godzina
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              handleDate(
                now.setTime(now.getTime() + 3 * 60 * 60 * 1000),
                "3 godziny"
              );
            }}
          >
            3 godziny
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              handleDate(
                now.setTime(now.getTime() + 24 * 60 * 60 * 1000),
                "1 dzień"
              );
            }}
          >
            1 dzień
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              handleDate(
                now.setTime(now.getTime() + 168 * 60 * 60 * 1000),
                "1 tydzień"
              );
            }}
          >
            1 tydzień
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              handleDate(
                now.setTime(now.getTime() + 8760 * 60 * 60 * 1000),
                "1 rok"
              );
            }}
          >
            1 rok
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item
            onClick={() => {
              setexpireDateText("Wybierz własna datę");
              setexpireDate(-1);
            }}
          >
            Wybierz własna datę
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      {expireDateText === "Wybierz własna datę" ? (
        <Form.Group className="col-6">
          <Form.Control
            type="datetime-local"
            onChange={(e) => {
              setCustomData(e.target.value);
            }}
          />
        </Form.Group>
      ) : null}
    </div>
  );
};
export default ExpirationTime;
