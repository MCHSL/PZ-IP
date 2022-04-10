import { DocumentNode } from "graphql";
import { useQuery } from "@apollo/client";
import {
  get_paste_metadata,
  get_paste_metadata_for_user,
  get_unreviewed_reports,
  get_users,
} from "./queries";

const PaginatingQuery = (
  query: DocumentNode,
  page: number,
  itemsPerPage: number,
  args?: Object,
  options?: Object
) => {
  return useQuery(query, {
    variables: {
      skip: page * itemsPerPage,
      take: itemsPerPage,
      ...args,
    },
    ...options,
  });
};

const getUsersPaginated = (
  page: number,
  itemsPerPage: number,
  args?: Object,
  options?: Object
) => {
  return PaginatingQuery(get_users, page, itemsPerPage, args, options);
};

const getPasteTitlesPaginated = (
  userId: number | null,
  page: number,
  itemsPerPage: number,
  args?: Object,
  options?: Object
) => {
  if (userId) {
    if (!args) {
      args = {};
    }
    return PaginatingQuery(
      get_paste_metadata_for_user,
      page,
      itemsPerPage,
      { userId, ...args },
      options
    );
  } else {
    return PaginatingQuery(
      get_paste_metadata,
      page,
      itemsPerPage,
      args,
      options
    );
  }
};

const getReportedPastesPaginated = (
  page: number,
  itemsPerPage: number,
  args?: Object,
  options?: Object
) => {
  return PaginatingQuery(
    get_unreviewed_reports,
    page,
    itemsPerPage,
    args,
    options
  );
};

export {
  getUsersPaginated,
  getPasteTitlesPaginated,
  getReportedPastesPaginated,
};
