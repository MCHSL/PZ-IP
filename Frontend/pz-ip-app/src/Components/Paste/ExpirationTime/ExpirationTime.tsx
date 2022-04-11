import React, { useState } from "react";
import { Dropdown, Form } from "react-bootstrap";

interface Props {
  expDate: any;
  setExpDate: (title: any) => void;
}

const ExpirationTime = ({ expDate, setExpDate }: Props) => {
  const [expDateText, setExpDateText] = useState("Nigdy");
  let now = new Date();
  function setCustomData(e: string) {
    let data = new Date(e);
    setExpDate(data);
  }
  function handleDate(e: any, text: string) {
    let data = new Date(e);
    setExpDateText(text);
    setExpDate(data);
  }
  return (
    <div className="row">
      <Dropdown className="col-6">
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          {expDateText}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item
            onClick={() => {
              setExpDateText("Nigdy");
              setExpDate(null);
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
              setExpDateText("Wybierz własna datę");
              setExpDate(-1);
            }}
          >
            Wybierz własna datę
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      {expDateText === "Wybierz własna datę" ? (
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
