import { useState } from "react";
import { useLocation } from "react-router-dom";
import { getPasteTitlesPaginated } from "../../../Queries/PaginatingQuery";
import { LocationState } from "../Types";
import PasteList from "./Base/PasteList";

export const AllPasteList = () => {
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
  } = getPasteTitlesPaginated(null, page, itemsPerPage);

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

  const { pastes, pasteCount: totalItems } = data;

  const props = {
    pastes,
    totalItems,
    page,
    itemsPerPage,
    setPage,
    setItemsPerPage,
    refetch,
  };

  return (
    <>
      <PasteList {...props} />
    </>
  );
};
