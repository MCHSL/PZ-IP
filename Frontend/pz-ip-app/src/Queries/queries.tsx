import { gql } from "@apollo/client";

export const login = gql`
  mutation ($email: String!, $password: String!) {
    tokenAuth(email: $email, password: $password) {
      token
    }
  }
`;

export const get_user = gql`
  query ($id: Int!) {
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
  query ($skip: Int, $take: Int) {
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
  mutation ($id: Int!) {
    deleteUser(id: $id) {
      ok
    }
  }
`;

export const create_user = gql`
  mutation ($email: String!, $password: String!, $username: String!) {
    createUser(email: $email, password: $password, username: $username) {
      user {
        id
        username
      }
    }
  }
`;

export const update_user = gql`
  mutation ($id: Int, $email: String, $username: String, $isStaff: Boolean) {
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
  query {
    me {
      id
      username
      isStaff
      isSuperuser
    }
  }
`;

export const get_paste = gql`
  query ($id: Int!) {
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
    }
  }
`;

export const update_paste = gql`
  mutation (
    $id: Int!
    $title: String!
    $content: String!
    $isPrivate: Boolean!
  ) {
    updatePaste(
      id: $id
      title: $title
      content: $content
      private: $isPrivate
    ) {
      paste {
        id
        title
        content
        private
      }
    }
  }
`;

export const create_paste = gql`
  mutation ($title: String!, $content: String!, $isPrivate: Boolean!) {
    createPaste(title: $title, content: $content, private: $isPrivate) {
      paste {
        id
      }
    }
  }
`;

export const delete_paste = gql`
  mutation ($id: Int!) {
    deletePaste(id: $id) {
      ok
    }
  }
`;

export const like_paste = gql`
  mutation ($id: Int!, $liking: Boolean!) {
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
  query ($skip: Int, $take: Int) {
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
  query ($skip: Int, $take: Int) {
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
  query ($userId: Int!, $skip: Int, $take: Int) {
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
