import React, { useState } from "react";
import { Alert } from "react-bootstrap";

interface Props {
  alerts: string[];
}

export const Alerting: React.FC<Props> = (props) => {
  const [isOn, setIsOn] = useState(true);
  if (props.alerts[0] != "" && isOn) {
    return (
      <>
        <Alert
          variant="danger"
          onClose={() => {
            setIsOn(false);
          }}
          dismissible
        >
          <Alert.Heading>{props.alerts[0]}</Alert.Heading>
          <span>{props.alerts[1]}</span>
        </Alert>
      </>
    );
  } else if (!isOn) {
    setIsOn(true);
    props.alerts[0] = "";
    props.alerts[1] = "";
  }
  return null;
};
