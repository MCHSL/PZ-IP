import React, { useState } from "react";
import { Dropdown, Form } from "react-bootstrap";

interface Props {
  expDate: number;
  setExpDate: (title: number) => void;
}

const ExpirationTime = ({ expDate, setExpDate }: Props) => {
  const [expDateText, setExpDateText] = useState("Nigdy");
  function setCustomData(e: string) {
    let data = new Date(e);
    const now = new Date();
    setExpDate((Number(data) - Number(now)) / 1000);
  }
  function handleDate(e: any, text: string) {
    setExpDateText(text);
    setExpDate(e);
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
              handleDate(0, "Nigdy");
            }}
          >
            Nigdy
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              handleDate(3600, "1 godzina");
            }}
          >
            1 godzina
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              handleDate(10800, "3 godziny");
            }}
          >
            3 godziny
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              handleDate(86400, "1 dzień");
            }}
          >
            1 dzień
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              handleDate(604800, "1 tydzień");
            }}
          >
            1 tydzień
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              handleDate(31536000, "1 rok");
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
