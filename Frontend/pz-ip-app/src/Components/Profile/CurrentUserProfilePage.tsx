import { Button, Stack } from "react-bootstrap";
import { useUser } from "../Context/CurrentUserContext";
import withLogin from "../Misc/LoginRequired";
import { UserPasteList } from "../Paste/PasteLists/UserPasteList";
import UserProfileInfo from "./UserProfileInfo";
import woman from "./tmpData/womanPlaceholder.jpg";

const CurrentUserProfilePage = () => {
  const { userLoading, user } = useUser();
  if (userLoading) {
    return <p>Loading...</p>;
  }
  return (
    <Stack gap={3} className="col-md-10 m-auto mt-5">
      <div className="row">
        <div className="col-2 text-center">
          {/* <img className="profilePicture" src={woman} />
          <h3>{user.username}</h3>
          <p>ashdjkash asdkjasgdsaj askdjsagkjd sagdasg</p>
          <Button>Edytuj profil</Button> */}
          <UserProfileInfo user_prop={user} />
        </div>
        <div className="col-10">
          <h1>Twoje wklejki</h1>
          <UserPasteList userId={Number(user.id)} />
        </div>
      </div>
    </Stack>
  );
};

export default withLogin(CurrentUserProfilePage);
