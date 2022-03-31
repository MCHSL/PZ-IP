import { ListGroup } from "react-bootstrap";
import { humanFileSize } from "../../Misc/Utils";
import { Attachment } from "../Types";
import { AttachmentButton } from "./AttachmentButton";
import { AttachmentPrintName } from "./AttachmentPrintName";

interface Props {
  attachment: Attachment;
  editable: boolean;

  removeAddedAttachment: (id: number) => void;
  markForRemoval: (id: number) => void;
  unmarkFromRemoval: (id: number) => void;
}

export const AttachmentRow = ({
  attachment,
  editable,
  removeAddedAttachment,
  markForRemoval,
  unmarkFromRemoval,
}: Props) => {
  if (editable && attachment.is_added) {
    return (
      <ListGroup.Item variant="success" key={attachment.id?.toString()}>
        <AttachmentButton
          show={editable}
          id={attachment.id as number}
          callback={removeAddedAttachment}
        />
        <AttachmentPrintName editable={editable} {...attachment} />
      </ListGroup.Item>
    );
  }

  if (editable && attachment.is_removed) {
    return (
      <ListGroup.Item variant="danger" key={attachment.id?.toString()}>
        <AttachmentButton
          show={editable}
          id={attachment.id as number}
          callback={unmarkFromRemoval}
        />
        <AttachmentPrintName editable={editable} {...attachment} />
      </ListGroup.Item>
    );
  }

  return (
    <ListGroup.Item key={attachment.id?.toString()}>
      <AttachmentButton
        show={editable}
        id={attachment.id as number}
        callback={markForRemoval}
      />
      <AttachmentPrintName editable={editable} {...attachment} />
    </ListGroup.Item>
  );
};
