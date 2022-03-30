import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { useState } from "react";
import { Stack, Button } from "react-bootstrap";

const Rate = () => {
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(1233);
  const heartColor: string = like ? "red" : "grey";
  function likeHandler() {
    setLike(!like);
    {
      like ? setLikeCount(likeCount - 1) : setLikeCount(likeCount + 1);
    }
  }
  return (
    <span className="float-end mt-5 pt-1 pb-1">
      <span className="align-middle">{likeCount}</span>
      <button
        //variant="link"
        className="heart-button align-middle"
        onClick={() => {
          likeHandler();
        }}
      >
        <FontAwesomeIcon
          style={{ fontSize: "30px", color: heartColor }}
          icon={solid("heart")}
          size="lg"
        />
      </button>
    </span>
  );
};

export default Rate;
