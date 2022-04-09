import { Dispatch, SetStateAction, useState } from "react";
import { delete_paste } from "../../Queries/queries";
import RefreshingModal from "./RefreshingModal";

interface Props {
  id: Number;
  pasteTitle: string;
  isVisible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  afterSubmit?: () => void;
  refetch: () => Promise<any>;
}

export const DeletePasteModal = ({ id, pasteTitle, ...rest }: Props) => {
  const [error, setError] = useState("");

  function onError(error: any) {
    setError(error.message);
  }

  const props = {
    title: "Usuń wklejkę",
    confirmText: "Usuń",
    mutation: delete_paste,
    mutationArgs: { id: Number(id) },
    validate: () => true,
    onError,
    onClosed: () => setError(""),
    ...rest,
  };

  return (
    <RefreshingModal {...props}>
      <div className="text-center">
        <h3>
          Czy na pewno chcesz usunąć wklejkę <b>{pasteTitle}</b>?
        </h3>
        {error && (
          <div className="alert alert-danger mt-3 text-center">{error}</div>
        )}
      </div>
    </RefreshingModal>
  );
};
