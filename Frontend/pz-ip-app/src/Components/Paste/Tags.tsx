import { useCallback } from "react";
import { Form } from "react-bootstrap";

import ReactTags from "react-tag-autocomplete";
import { usePaste } from "../Context/CurrentPasteContext";

function Tag(props: any) {
  return (
    <button
      type="button"
      className={props.classNames.selectedTag}
      title={props.removeButtonText}
      onClick={props.onDelete}
      disabled={props.disabled}
    >
      <span className={props.classNames.selectedTagName}>{props.tag.name}</span>
    </button>
  );
}

interface Props {
  editable: boolean;
}

const Tags = ({ editable }: Props) => {
  const { paste, updatePaste } = usePaste();

  const tags = paste.tags.map((tag) => ({
    id: tag,
    name: tag,
    disabled: true,
  }));

  console.log("tags", tags);

  const onDelete = useCallback(
    (tagIndex) => {
      updatePaste({
        tags: tags.filter((_, i) => i !== tagIndex).map((t) => t.name),
      });
    },
    [tags, updatePaste]
  );

  const onAddition = useCallback(
    (newTag) => {
      updatePaste({ tags: [...tags, newTag].map((t) => t.name) });
    },
    [tags, updatePaste]
  );

  if (!editable && paste.tags.length === 0) {
    return null;
  }

  let bruh = editable ? (
    <ReactTags
      inputAttributes={{ disabled: !editable }}
      placeholderText={editable ? "Dodaj tagi..." : ""}
      delimiters={[",", " ", "Enter"]}
      tags={tags}
      onDelete={onDelete}
      onAddition={onAddition}
      allowNew={true}
      allowBackspace={false}
      tagComponent={Tag}
      removeButtonText="Usuń"
    />
  ) : (
    <div>
      {tags.map((tag) => (
        <Tag
          key={tag.id}
          tag={tag}
          classNames={{
            root: "react-tags__tag",
            selectedTag: "react-tags__selected-tag-no-delete",
            selectedTagName: "react-tags__selected-tag-name",
          }}
          disabled={true}
        />
      ))}
    </div>
  );

  return (
    <Form.Group className="mb-3">
      <label className="mb-1">Tagi</label>
      {bruh}
    </Form.Group>
  );
};

export default Tags;
