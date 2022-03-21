import { DocumentNode } from "graphql";
import { useQuery } from "@apollo/client";
import { get_paste_titles, get_paste_titles_for_user, get_users } from "./queries";

const PaginatingQuery = (query: DocumentNode, args: Object, page: number, itemsPerPage: number, skip: boolean = false) =>
{
	return useQuery(query, {
		variables: {
			skip: page * itemsPerPage,
			take: itemsPerPage,
			...args,
		},
		skip
	})
}

const getUsersPaginated = (page: number, itemsPerPage: number, skip: boolean = false) =>
{
	return PaginatingQuery(get_users, {}, page, itemsPerPage, skip);
}

const getPasteTitlesPaginated = (userId: number | null, page: number, itemsPerPage: number, skip: boolean = false) =>
{
	if(userId) {
		return PaginatingQuery(get_paste_titles_for_user, { userId }, page, itemsPerPage, skip);
	} else {
		return PaginatingQuery(get_paste_titles, {}, page, itemsPerPage, skip);
	}

}


export { getUsersPaginated, getPasteTitlesPaginated };
