import { humanFileSize } from "../../Misc/Utils";

interface Props {
  editable: boolean;
  name: string;
  size: number;
  url?: string;
}

export const AttachmentPrintName = ({ editable, name, size, url }: Props) => {
  return (
    <>
      {!editable ? (
        <a style={{ verticalAlign: "baseline" }} href={url}>
          {name}
        </a>
      ) : (
        <span style={{ verticalAlign: "baseline" }}>{name}</span>
      )}
      <span
        style={{ verticalAlign: "baseline", float: "right" }}
        className="text-muted"
      >
        {humanFileSize(size ?? 0)}
      </span>
    </>
  );
};
