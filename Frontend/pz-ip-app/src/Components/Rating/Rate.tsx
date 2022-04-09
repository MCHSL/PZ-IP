import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { like_paste } from "../../Queries/queries";

interface Props {
  id: number;
  pasteLikes: number;
  liking: boolean;
  disabled: boolean;
}

const Rate = ({ id, pasteLikes, liking, disabled }: Props) => {
  const [isLiking, setLiking] = useState(liking);
  const [likeCount, setLikeCount] = useState(pasteLikes);
  const heartColor: string = isLiking ? "red" : "grey";

  const saved_state = { liking, likeCount };

  const [doLike] = useMutation(like_paste, {
    onError: (error) => {
      console.log(error);
      setLiking(saved_state.liking);
      setLikeCount(saved_state.likeCount);
    },
  });

  function likeHandler() {
    if (isLiking) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }

    setLiking(!isLiking);
    doLike({
      variables: {
        id,
        liking: !isLiking,
      },
    });
  }

  return (
    <span className="pt-1 pb-1">
      <span className="align-middle">{likeCount}</span>
      <button
        className="paste-like-button align-middle"
        disabled={disabled}
        onClick={likeHandler}
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
