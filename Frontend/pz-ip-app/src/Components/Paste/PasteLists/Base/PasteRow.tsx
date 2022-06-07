import { Button, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { DateTime } from "luxon";
import { DeletePasteModal } from "../../../Modals/DeletePasteModal";
import { useUser } from "../../../Context/CurrentUserContext";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PasteMeta } from "../../Types";

interface Props {
  paste?: PasteMeta;
  page: number;
  itemsPerPage: number;
  refetch: () => Promise<any>;
}

const PasteRow = ({ paste, page, itemsPerPage, refetch }: Props) => {
  const navigate = useNavigate();
  const [isDeleteVisible, setDeleteVisible] = useState<boolean>(false);

  const { user } = useUser();
  const location = useLocation();

  if (!paste) {
    return (
      <tr style={{ visibility: "hidden" }}>
        <td colSpan={7} style={{ border: "1px solid transparent" }}>
          <Button>Kto czyta ten trąba</Button>
        </td>
      </tr>
    );
  }

  const formattedCreatedAt = paste.createdAt
    ? DateTime.fromJSDate(new Date(paste.createdAt)).toFormat(
        "yyyy-MM-dd HH:mm"
      )
    : "";

  const formattedUpdatedAt = paste.updatedAt
    ? DateTime.fromJSDate(new Date(paste.updatedAt)).toFormat(
        "yyyy-MM-dd HH:mm"
      )
    : "";

  return (
    <>
      <DeletePasteModal
        id={paste.id}
        pasteTitle={paste.title}
        isVisible={isDeleteVisible}
        setVisible={setDeleteVisible}
        refetch={refetch}
      />
      <tr>
        <td>
          <Button
            variant="link"
            onClick={() =>
              navigate(`/paste/${paste.id}`, {
                state: { returnTo: location.pathname, page, itemsPerPage },
              })
            }
          >
            {paste.title}
          </Button>
        </td>

        <td className="text-muted" style={{ verticalAlign: "middle" }}>
          {formattedCreatedAt}
        </td>

        <td className="text-muted" style={{ verticalAlign: "middle" }}>
          {formattedUpdatedAt}
        </td>

        <td className="text-muted" style={{ verticalAlign: "middle" }}>
          {paste.author ? (
            <Button
              variant="link"
              className="p-0"
              onClick={() => {
                if (!paste.author) {
                  return;
                }
                navigate(`/profile/${paste.author.id}`, {
                  state: {
                    returnTo: location.pathname,
                    page,
                    itemsPerPage,
                  },
                });
              }}
            >
              {paste.author.username}
            </Button>
          ) : (
            "Anonim"
          )}
        </td>

        <td className="text-muted" style={{ verticalAlign: "middle" }}>
          {paste.likeCount}
          {paste.isLiked ? (
            <FontAwesomeIcon
              style={{ marginLeft: "5px", color: "red" }}
              icon={solid("heart")}
            />
          ) : null}
        </td>

        <td
          className="text-muted"
          style={{ verticalAlign: "middle", textAlign: "center" }}
        >
          <Form.Check type="checkbox" checked={paste.isPrivate} disabled />
        </td>

        {user &&
        (user?.isStaff || (paste.author && user.id === paste.author.id)) ? (
          <td>
            <button
              className="btn btn-danger"
              onClick={() => {
                setDeleteVisible(true);
              }}
            >
              Usuń
              <FontAwesomeIcon
                style={{ marginLeft: "5px" }}
                icon={solid("trash-can")}
              />
            </button>
          </td>
        ) : (
          <td></td>
        )}
      </tr>
    </>
  );
};

export default PasteRow;
