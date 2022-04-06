import { useApolloClient } from "@apollo/client";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { getPasteTitlesPaginated } from "../../../Queries/PaginatingQuery";
import { get_paste_titles_for_user } from "../../../Queries/queries";
import { LocationState } from "../Types";
import PasteList from "./Base/PasteList";

interface Props {
  userId: number;
}

export const UserPasteList = ({ userId }: Props) => {
  const location = useLocation();
  const loc_state = location.state as LocationState;
  const apolloClient = useApolloClient();

  const [page, setPage] = useState(loc_state?.page || 0);
  const [itemsPerPage, setItemsPerPage] = useState(
    loc_state?.itemsPerPage || 10
  );

  // Prefetch the second page
  apolloClient.query({
    query: get_paste_titles_for_user,
    variables: {
      userId: userId,
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

  function prefetchPagesAround(newPage: number) {
    const pages_to_fetch = [newPage - 1, newPage, newPage + 1];
    pages_to_fetch.forEach((page) => {
      if (page >= 0 && page < totalItems) {
        apolloClient.query({
          query: get_paste_titles_for_user,
          variables: {
            userId: userId,
            skip: page * itemsPerPage,
            take: itemsPerPage,
          },
        });
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
