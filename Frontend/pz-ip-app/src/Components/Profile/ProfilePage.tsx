import { useQuery } from "@apollo/client";
import { Stack } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { get_user } from "../../Queries/queries";
import { UserPasteList } from "../Paste/PasteLists/UserPasteList";

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
    <Stack gap={3} className="col-md-8 m-auto mt-5">
      <h1>Wklejki użytkownika {user.username}</h1>
      <UserPasteList userId={Number(id)} />
    </Stack>
  );
};

export default ProfilePage;
