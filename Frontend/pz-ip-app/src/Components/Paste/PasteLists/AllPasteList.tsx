import { useApolloClient } from "@apollo/client";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { getPasteTitlesPaginated } from "../../../Queries/PaginatingQuery";
import { get_paste_metadata } from "../../../Queries/queries";
import { LocationState } from "../Types";
import PasteList from "./Base/PasteList";
import PasteFilter from "./PasteFilter";

export const AllPasteList = () => {
  const location = useLocation();
  const loc_state = location.state as LocationState;
  const apolloClient = useApolloClient();

  const [page, setPage] = useState(loc_state?.page || 0);
  const [itemsPerPage, setItemsPerPage] = useState(
    loc_state?.itemsPerPage || 10
  );

  const [searchOptions, setSearchOptions] = useState({});

  // Prefetch the second page
  apolloClient.query({
    query: get_paste_metadata,
    variables: {
      skip: (page + 1) * itemsPerPage,
      take: itemsPerPage,
    },
  });

  const {
    loading,
    error,
    previousData,
    data = previousData,
    refetch,
  } = getPasteTitlesPaginated(null, page, itemsPerPage, {
    filters: searchOptions,
  });

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

  const { pastes, count: totalItems } = data.pastes;

  // TODO: find a way to not copy paste code
  function prefetchPagesAround(newPage: number) {
    const pages_to_fetch = [newPage - 1, newPage, newPage + 1];
    pages_to_fetch.forEach((page) => {
      if (page >= 0 && page < totalItems) {
        apolloClient.query({
          query: get_paste_metadata,
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

  function onSearch(newSearchOptions: any) {
    setSearchOptions(newSearchOptions);
    setPage(0);
  }

  return (
    <>
      <PasteFilter onSearch={onSearch} loading={loading} />
      <PasteList {...props} />
    </>
  );
};
