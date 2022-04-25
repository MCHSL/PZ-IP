import React, { useState } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import { useUser } from "../Context/CurrentUserContext";
import withLogin from "../Misc/LoginRequired";
import { UserPasteList } from "../Paste/PasteLists/UserPasteList";
import Reports from "../Paste/Reports/Reports";
import woman from "./tmpData/womanPlaceholder.jpg";

const UserProfileInfo = (user_prop: any) => {
  const [editProfile, setEditProfile] = useState(false);
  const { userLoading, user } = useUser();
  const [newUsername, setNewUsername] = useState(user_prop.user_prop.username);
  const [newUserBio, setnewUserBio] = useState(user_prop.user_prop.bio);
  const [file, setFile] = useState("");
  let content = file as string;
  content = content?.slice(content.lastIndexOf("\\") + 1);
  if (userLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <img className="profilePicture" src={woman} />
      {!editProfile && (
        <>
          <h3>{user_prop.user_prop.username}</h3>{" "}
          <p>ashdjkash asdkjasgdsaj askdjsagkjd sagdasg</p>
          {user.id === user_prop.user_prop.id && (
            <Button
              onClick={() => {
                setEditProfile(true);
              }}
            >
              Edytuj profil
            </Button>
          )}
        </>
      )}
      {editProfile && (
        <>
          <Form className="mt-3">
            <Reports />
            <Form.Group className="mb-3 text-start">
              <label className="mb-1">Nazwa użytkownika</label>
              <Form.Control
                type="text"
                value={newUsername}
                placeholder={newUsername}
                onChange={(e) => {
                  setNewUsername(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3 text-start">
              <label className="mb-1">Opis</label>
              <Form.Control
                as="textarea"
                value={newUserBio}
                placeholder={newUserBio}
                onChange={(e) => {
                  setnewUserBio(e.target.name);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3 text-start">
              <div
                style={{
                  outline: "1px dashed #ced4da",
                  borderRadius: ".25rem",
                  textAlign: "center",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    margin: "auto",
                    padding: "1vh",
                  }}
                  className="text-muted"
                >
                  <label htmlFor="files">Kliknij aby dodać zdjęcie</label>
                  <input
                    type="file"
                    id="files"
                    onChange={(e) => {
                      setFile(e.target.value);
                    }}
                  />
                </div>
              </div>
              {content}
            </Form.Group>
          </Form>
          <Button
            className="me-1"
            onClick={() => {
              setEditProfile(false);
            }}
          >
            Anuluj
          </Button>
          <Button
            onClick={() => {
              setEditProfile(false);
            }}
          >
            Zapisz
          </Button>
        </>
      )}
    </>
  );
};

export default withLogin(UserProfileInfo);
