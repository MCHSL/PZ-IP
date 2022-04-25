import { useQuery } from "@apollo/client";
import { Stack } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { get_user } from "../../Queries/queries";
import { useUser } from "../Context/CurrentUserContext";
import { UserPasteList } from "../Paste/PasteLists/UserPasteList";
import UserProfileInfo from "./UserProfileInfo";

const ProfilePage = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(get_user, {
    variables: {
      id: Number(id),
    },
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const { user } = data;

  return (
    <Stack gap={3} className="col-md-10 m-auto mt-5">
      <div className="row">
        <div className="col-2 text-center">
          <UserProfileInfo user_prop={user} />
        </div>
        <div className="col-10">
          <h1>Wklejki użytkownika {user.username}</h1>
          <UserPasteList userId={Number(id)} />
        </div>
      </div>
    </Stack>
  );
};

export default ProfilePage;
