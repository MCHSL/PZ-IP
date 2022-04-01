import { useState } from "react";
import { useLocation } from "react-router-dom";
import { getPasteTitlesPaginated } from "../../../Queries/PaginatingQuery";
import { LocationState } from "../Types";
import PasteList from "./Base/PasteList";

interface Props {
  userId: number;
}

export const UserPasteList = ({ userId }: Props) => {
  const location = useLocation();
  const loc_state = location.state as LocationState;

  const [page, setPage] = useState(loc_state?.page || 0);
  const [itemsPerPage, setItemsPerPage] = useState(
    loc_state?.itemsPerPage || 10
  );

  const {
    loading,
    error,
    previousData,
    data = previousData,
    refetch,
  } = getPasteTitlesPaginated(userId, page, itemsPerPage);

  if (loading && !data) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <p>
        Error: {error.message}
        <button onClick={() => refetch()}>Retry</button>
      </p>
    );
  }

  const { pastes, pasteCount: totalItems } = data.user;

  function setItemsPerPageProxy(newItemsPerPage: number) {
    setItemsPerPage(newItemsPerPage);
    setPage(Math.floor((page * itemsPerPage) / newItemsPerPage));
  }

  const props = {
    pastes,
    totalItems,
    page,
    itemsPerPage,
    setPage,
    setItemsPerPage: setItemsPerPageProxy,
    refetch,
  };

  return (
    <>
      <PasteList {...props} />
    </>
  );
};
