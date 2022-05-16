import { useMutation, useQuery } from "@apollo/client";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { get_user_profile, personalize_user } from "../../Queries/queries";
import { useUser } from "../Context/CurrentUserContext";
import withLogin from "../Misc/LoginRequired";
import { UserPasteList } from "../Paste/PasteLists/UserPasteList";
import Reports from "../Paste/Reports/Reports";
import woman from "./tmpData/womanPlaceholder.jpg";

const UserProfileInfo = (user_prop: any) => {
  const [editProfile, setEditProfile] = useState(false);
  const { userLoading, user } = useUser();
  const [newUsername, setNewUsername] = useState(user_prop.user_prop.username);
  const [newUserId, setnewUserId] = useState(user_prop.user_prop.id);
  const [newUserBio, setnewUserBio] = useState(user_prop.user_prop.description);
  const [file, setFile] = useState({ name: "", content: "" });
  const [isValid, setIsValid] = useState("");
  const [personalize] = useMutation(personalize_user, {
    onCompleted: (data) => {
      setEditProfile(false);
    },
  });
  function onConfirm() {
    if (newUsername !== "") {
      personalize({
        variables: {
          id: Number(user_prop.user_prop.id),
          username: newUsername,
          description: newUserBio,
          avatar: file.name ? file : null,
        },
      });
    } else {
      setIsValid("Nazwa użytkownika nie może być pusta");
    }
  }
  function onCancel() {
    setNewUsername(user_prop.user_prop.username);
    setnewUserBio(user_prop.user_prop.description);
    setFile(user_prop.user_prop.avatar);
    setEditProfile(false);
    setIsValid("");
  }

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file: File) => {
      const reader = new FileReader();
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        let content = reader.result as string;
        content = content?.slice(content.indexOf(",") + 1);
        const avatar = {
          name: file.name,
          content,
        };
        setFile(avatar);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  const border = isDragActive ? "3px dashed #ced4da" : "1px dashed #ced4da";

  if (userLoading) {
    return <p>Loading...</p>;
  }
  return (
    <>
      {!user_prop.user_prop.avatar ? null : (
        <img className="profilePicture" src={user_prop.user_prop.avatar} />
      )}
      {!editProfile && (
        <>
          <h3>{user_prop.user_prop.username}</h3>{" "}
          {user_prop.user_prop.description ? (
            <p>{user_prop.user_prop.description}</p>
          ) : (
            <p>Brak opisu</p>
          )}
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
                  setnewUserBio(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3 text-start">
              <div
                {...getRootProps()}
                style={{
                  outline: border,
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
                  <input {...getInputProps()} />
                  <div>Przeciągnij plik lub kliknij, aby wybrać</div>
                  <div>Max. 5 MB</div>
                </div>
              </div>
            </Form.Group>
          </Form>
          {isValid !== "" ? (
            <div className="alert alert-danger mt-3 text-center">{isValid}</div>
          ) : null}
          <Button
            className="me-1"
            onClick={() => {
              onCancel();
            }}
          >
            Anuluj
          </Button>
          <Button
            onClick={() => {
              onConfirm();
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
