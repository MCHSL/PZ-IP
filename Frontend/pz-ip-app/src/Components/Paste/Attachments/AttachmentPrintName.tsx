import { humanFileSize } from "../../Misc/Utils";

interface Props {
  editable: boolean;
  name: string;
  size: number;
  url?: string;
}

const DOWNLOAD_DOMAIN =
  process.env.NODE_ENV === "development" ? "http://localhost:80" : "";

export const AttachmentPrintName = ({ editable, name, size, url }: Props) => {
  return (
    <>
      {!editable ? (
        <a style={{ verticalAlign: "baseline" }} href={DOWNLOAD_DOMAIN + url}>
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
