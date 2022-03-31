import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  show: boolean;
  id: number;
  callback: (id: number) => void;
}

export const AttachmentButton = ({ show, id, callback }: Props) => {
  if (!show) {
    return null;
  }

  return (
    <span
      onClick={() => callback(id)}
      style={{
        cursor: "pointer",
        marginRight: "5px",
        verticalAlign: "baseline",
      }}
    >
      <FontAwesomeIcon icon={solid("xmark")} size="lg" />
    </span>
  );
};
