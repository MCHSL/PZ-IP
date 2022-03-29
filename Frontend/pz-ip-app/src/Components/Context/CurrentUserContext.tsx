import {
  ApolloError,
  ApolloQueryResult,
  useQuery,
  useApolloClient,
} from "@apollo/client";
import React from "react";
import { get_current_user } from "../../Queries/queries";

interface IUserContext {
  userLoading: boolean;
  userError: ApolloError | undefined;
  user: {
    id: number;
    username: string;
    email: string;
    isStaff: boolean;
    isSuperuser: boolean;
  };
  refetchUser: (variables?: any) => Promise<ApolloQueryResult<any>>;
  logout: () => Promise<any>;
}

const UserContext = React.createContext({} as IUserContext);

export const UserProvider = ({ children }: { children: JSX.Element }) => {
  const client = useApolloClient();
  const {
    loading,
    error,
    previousData,
    data = previousData,
    refetch,
  } = useQuery(get_current_user);

  function logout() {
    localStorage.removeItem("token");
    return client.resetStore();
  }

  return (
    <UserContext.Provider
      value={{
        userLoading: loading,
        userError: error,
        user: error || loading ? null : data?.me,
        refetchUser: refetch,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => React.useContext(UserContext);
