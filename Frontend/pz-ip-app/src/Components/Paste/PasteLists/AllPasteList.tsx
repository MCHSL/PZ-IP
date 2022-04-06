import { useApolloClient } from "@apollo/client";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { getPasteTitlesPaginated } from "../../../Queries/PaginatingQuery";
import { get_paste_titles } from "../../../Queries/queries";
import { LocationState } from "../Types";
import PasteList from "./Base/PasteList";

export const AllPasteList = () => {
  const location = useLocation();
  const loc_state = location.state as LocationState;
  const apolloClient = useApolloClient();

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

  // TODO: find a way to not copy paste code
  function prefetchPagesAround(newPage: number) {
    const pages_to_fetch = [newPage - 1, newPage, newPage + 1];
    pages_to_fetch.forEach((page) => {
      if (page >= 0 && page < totalItems) {
        apolloClient.query({
          query: get_paste_titles,
          variables: {
            skip: page * itemsPerPage,
            take: itemsPerPage,
          },
        }); //Good ol' leaky abstraction
      }
    });
    setPage(newPage);
  }

  const props = {
    pastes,
    totalItems,
    page,
    itemsPerPage,
    setPage: prefetchPagesAround,
    setItemsPerPage,
    refetch,
  };

  return (
    <>
      <PasteList {...props} />
    </>
  );
};
