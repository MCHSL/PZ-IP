import { useParams } from "react-router-dom";
import ViewEditPaste from "./ViewEditPaste";

const PasteIndex = () => {
  const params = useParams();
  return (
    <div
      style={{
        width: "50%",
        margin: "auto",
      }}
    >
      <ViewEditPaste id={Number(params.id)} />
    </div>
  );
};

export default PasteIndex;
