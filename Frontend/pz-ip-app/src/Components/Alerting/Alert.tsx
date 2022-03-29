import React, { useState } from "react";
import { Alert } from "react-bootstrap";

interface Props {
  alerts: string[];
}

export const Alerting: React.FC<Props> = (props) => {
  const [isOn, setIsOn] = useState(true);
  if (props.alerts[0] != "" && isOn) {
    return (
      <span>{props.alerts[1]}</span>
    );
  } else if (!isOn) {
    setIsOn(true);
    props.alerts[0] = "";
    props.alerts[1] = "";
  }
  return null;
};
