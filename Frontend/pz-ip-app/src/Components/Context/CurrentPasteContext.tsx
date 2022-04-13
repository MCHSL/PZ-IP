import {
  ApolloError,
  ApolloQueryResult,
  useMutation,
  useQuery,
} from "@apollo/client";
import React, { useCallback, useMemo } from "react";
import {
  create_paste,
  get_paste,
  get_paste_metadata,
  get_paste_metadata_for_user,
  update_paste,
} from "../../Queries/queries";
import { Paste } from "../Paste/Types";

interface IPasteContext {
  pasteLoading: boolean;
  pasteError: ApolloError | undefined;
  paste: Paste;
  refetchPaste: (variables?: any) => Promise<ApolloQueryResult<any>>;
  setPaste: (id: number | null) => void;
  updatePaste: (variables: Partial<Paste>) => void;
  savePaste: () => Promise<any>;
}

const PasteContext = React.createContext({} as IPasteContext);

export const PasteProvider = ({ children }: { children: JSX.Element }) => {
  const emptyPaste = useMemo(() => {
    return {
      id: 0,
      title: "",
      content: "",
      createdAt: null,
      updatedAt: null,
      expireDate: null,
      isPrivate: false,
      likeCount: 0,
      isLiked: false,
      isReported: false,
      author: { username: "", id: null },
      reports: [],
      attachments: [],
      fileDelta: { added: [], removed: [] },
    };
  }, []);

  const [id, setId] = React.useState<number | null>(null);
  const [pasteItself, setPasteItself] = React.useState<Paste>(emptyPaste);
  const { loading, error, refetch } = useQuery(get_paste, {
    variables: { id },
    skip: !id,
    onCompleted: (data) => {
      setPasteItself(data.paste);
    },
  });

  const [doUpdate] = useMutation(update_paste);
  const [doCreate] = useMutation(create_paste);

  function savePaste() {
    const fileDelta = {
      added: pasteItself?.attachments
        .filter((a) => a.is_added)
        .map((a) => {
          return { name: a.name, content: a.content };
        }),
      removed: pasteItself?.attachments
        .filter((a) => a.is_removed)
        .map((a) => {
          return { id: a.id };
        }),
    };
    const expireDate =
      pasteItself?.expireDate && new Date(pasteItself.expireDate).toISOString();
    const refetchQueries = [get_paste_metadata, get_paste_metadata_for_user];

    if (id && id > 0) {
      return doUpdate({
        variables: {
          ...pasteItself,
          expireDate,
          fileDelta,
          id,
        },
        refetchQueries,
      });
    } else if (id === -1) {
      return doCreate({
        variables: {
          ...pasteItself,
          expireDate,
          fileDelta,
        },
        refetchQueries,
      });
    } else {
      return Promise.reject("you fucked up");
    }
  }

  const updatePaste = useCallback(
    (fields: Partial<Paste>) => {
      setPasteItself({ ...pasteItself, ...fields });
    },
    [pasteItself]
  );

  const setPaste = useCallback(
    (id: number | null) => {
      setId(id);
      if (id === null) {
        setPasteItself(emptyPaste);
      } else if (id === -1) {
        //TODO: Some special typescript enforced value instead of -1
        setPasteItself({
          id: 0,
          title: "",
          content: "",
          createdAt: null,
          updatedAt: null,
          expireDate: null,
          isPrivate: false,
          likeCount: 0,
          isLiked: false,
          isReported: false,
          author: { username: "", id: null },
          reports: [],
          attachments: [],
          fileDelta: { added: [], removed: [] },
        });
      }
    },
    [emptyPaste]
  );

  return (
    <PasteContext.Provider
      value={{
        pasteLoading: loading,
        pasteError: error,
        paste: id === null ? emptyPaste : pasteItself || emptyPaste,
        refetchPaste: refetch,
        setPaste,
        updatePaste,
        savePaste,
      }}
    >
      {children}
    </PasteContext.Provider>
  );
};

export const usePaste = () => React.useContext(PasteContext);
