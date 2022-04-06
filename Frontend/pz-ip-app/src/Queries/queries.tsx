import { gql } from "@apollo/client";

export const login = gql`
  mutation Login($email: String!, $password: String!) {
    tokenAuth(email: $email, password: $password) {
      payload
    }
  }
`;

export const refresh = gql`
  mutation Refresh {
    refreshToken {
      payload
    }
  }
`;

export const do_logout = gql`
  mutation Logout {
    deleteTokenCookie {
      deleted
    }
    deleteRefreshTokenCookie {
      deleted
    }
  }
`;

export const get_user = gql`
  query GetUser($id: Int!) {
    user(id: $id) {
      id
      username
      email
      isStaff
      isSuperuser
    }
  }
`;

export const get_users = gql`
  query GetUsers($skip: Int, $take: Int) {
    userCount
    users(skip: $skip, take: $take) {
      id
      username
      isStaff
      email
      dateJoined
      isActive
      isSuperuser
    }
  }
`;

export const delete_user = gql`
  mutation DeleteUser($id: Int!) {
    deleteUser(id: $id) {
      ok
    }
  }
`;

export const create_user = gql`
  mutation CreateUser($email: String!, $password: String!, $username: String!) {
    createUser(email: $email, password: $password, username: $username) {
      user {
        id
        username
      }
    }
  }
`;

export const update_user = gql`
  mutation UpdateUser(
    $id: Int
    $email: String
    $username: String
    $isStaff: Boolean
  ) {
    updateUser(id: $id, email: $email, username: $username, isStaff: $isStaff) {
      user {
        id
        username
        email
        isStaff
      }
    }
  }
`;

export const get_current_user = gql`
  query GetCurrentUser {
    me {
      id
      username
      isStaff
      isSuperuser
    }
  }
`;

export const get_paste = gql`
  query GetPaste($id: Int!) {
    paste(id: $id) {
      id
      title
      content
      isPrivate: private
      isLiked
      likeCount
      author {
        id
        username
      }
      attachments {
        id
        name
        url
        size
      }
    }
  }
`;

export const update_paste = gql`
  mutation UpdatePaste(
    $id: Int!
    $title: String!
    $content: String!
    $isPrivate: Boolean!
    $fileDelta: FileDelta!
  ) {
    updatePaste(
      id: $id
      title: $title
      content: $content
      private: $isPrivate
      fileDelta: $fileDelta
    ) {
      paste {
        id
        title
        content
        private
        attachments {
          id
          name
          url
          size
        }
      }
    }
  }
`;

export const create_paste = gql`
  mutation CreatePaste(
    $title: String!
    $content: String!
    $isPrivate: Boolean!
    $fileDelta: FileDelta!
  ) {
    createPaste(
      title: $title
      content: $content
      private: $isPrivate
      fileDelta: $fileDelta
    ) {
      paste {
        id
      }
    }
  }
`;

export const delete_paste = gql`
  mutation DeletePaste($id: Int!) {
    deletePaste(id: $id) {
      ok
    }
  }
`;

export const like_paste = gql`
  mutation LikePaste($id: Int!, $liking: Boolean!) {
    likePaste(id: $id, liking: $liking) {
      paste {
        id
        isLiked
        likeCount
      }
    }
  }
`;

export const get_pastes = gql`
  query GetPAstes($skip: Int, $take: Int) {
    pasteCount
    pastes(skip: $skip, take: $take) {
      id
      title
      content
      isPrivate: private
      author {
        id
        username
      }
    }
  }
`;

export const get_paste_titles = gql`
  query GetPasteTitles($skip: Int, $take: Int) {
    pasteCount
    pastes(skip: $skip, take: $take) {
      id
      title
      createdAt
      updatedAt
      likeCount
      isLiked
      isPrivate: private
      author {
        id
        username
      }
    }
  }
`;

export const get_paste_titles_for_user = gql`
  query GetPasteTitlesForUser($userId: Int!, $skip: Int, $take: Int) {
    user(id: $userId) {
      id
      pasteCount
      pastes(skip: $skip, take: $take) {
        id
        title
        createdAt
        updatedAt
        isPrivate: private
        likeCount
        isLiked
        author {
          id
          username
        }
      }
    }
  }
`;
