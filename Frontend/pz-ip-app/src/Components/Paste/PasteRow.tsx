import { Button, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { DateTime } from "luxon";
import { DeletePasteModal } from "../Modals/DeletePasteModal";
import { useUser } from "../Context/CurrentUserContext";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  id: Number;
  title: string;
  author: any;
  createdAt: Date;
  updatedAt: Date;
  isPrivate: boolean;
  refetch: () => {};
}

const PasteRow = ({
  id,
  title,
  author,
  createdAt,
  updatedAt,
  isPrivate,
  refetch,
}: Props) => {
  const navigate = useNavigate();
  const [isDeleteVisible, setDeleteVisible] = useState<boolean>(false);
  const formattedCreatedAt = DateTime.fromJSDate(new Date(createdAt)).toFormat(
    "yyyy-MM-dd HH:mm"
  );
  const formattedUpdatedAt = DateTime.fromJSDate(new Date(updatedAt)).toFormat(
    "yyyy-MM-dd HH:mm"
  );
  const { user } = useUser();
  const location = useLocation();

  return (
    <>
      <DeletePasteModal
        id={id}
        title={title}
        isVisible={isDeleteVisible}
        setVisible={setDeleteVisible}
        refetch={refetch}
      />
      <tr>
        <td>
          <Button
            variant="link"
            onClick={() =>
              navigate(`/paste/${id}`, {
                state: { returnTo: location.pathname },
              })
            }
          >
            {title}
          </Button>
        </td>
        <td className="text-muted" style={{ verticalAlign: "middle" }}>
          {formattedCreatedAt}
        </td>
        <td className="text-muted" style={{ verticalAlign: "middle" }}>
          {formattedUpdatedAt}
        </td>
        <td
          className="text-muted"
          style={{ verticalAlign: "middle", textAlign: "center" }}
        >
          <Form.Check type="checkbox" checked={isPrivate} disabled />
        </td>
        {user && (user?.isStaff || user.id === author.id) ? (
          <td>
            <Button
              variant="link"
              onClick={() => {
                setDeleteVisible(true);
              }}
            >
              <FontAwesomeIcon icon={solid("trash-can")} />
            </Button>
          </td>
        ) : (
          <td></td>
        )}
      </tr>
    </>
  );
};

export default PasteRow;
