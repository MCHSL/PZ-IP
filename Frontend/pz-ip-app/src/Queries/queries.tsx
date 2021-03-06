import { gql } from "@apollo/client";

export const login = gql`
  mutation Login($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      ok
    }
  }
`;

export const do_logout = gql`
  mutation Logout {
    logoutUser {
      ok
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

export const get_user_profile = gql`
  query GetUserProfile($id: Int!) {
    user(id: $id) {
      id
      username
      description
      avatar
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
      id
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
      avatar
      description
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
      expireDate
      tags
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
      isReported
      reports {
        id
        reporter {
          id
          username
        }
        reason
        createdAt
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
    $fileDelta: FileDelta
    $expireDate: DateTime
    $tags: [String]
  ) {
    updatePaste(
      id: $id
      title: $title
      content: $content
      private: $isPrivate
      fileDelta: $fileDelta
      expireDate: $expireDate
      tags: $tags
    ) {
      paste {
        id
        title
        content
        private
        expireDate
        tags
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
    $fileDelta: FileDelta
    $expireDate: DateTime
    $tags: [String]
  ) {
    createPaste(
      title: $title
      content: $content
      private: $isPrivate
      fileDelta: $fileDelta
      expireDate: $expireDate
      tags: $tags
    ) {
      paste {
        id
        title
        createdAt
        updatedAt
        likeCount
        isLiked
        isPrivate: private
        expireDate
        tags
        author {
          id
          username
        }
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

export const report_paste = gql`
  mutation ReportPaste($id: Int!, $reason: String!) {
    reportPaste(id: $id, reason: $reason) {
      ok
    }
  }
`;

export const delete_report = gql`
  mutation DeleteReport($id: Int!) {
    deleteReport(id: $id) {
      ok
    }
  }
`;

export const delete_all_reports = gql`
  mutation DeleteAllReports($id: Int!) {
    deleteAllReports(id: $id) {
      ok
    }
  }
`;

export const get_pastes = gql`
  query GetPastes(
    $skip: Int!
    $take: Int!
    $filters: PasteFilterOptions
    $orderBy: PasteOrdering
  ) {
    pasteCount
    pastes(skip: $skip, take: $take, filters: $filters, orderBy: $orderBy) {
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

export const get_paste_metadata = gql`
  query GetPasteTitles(
    $skip: Int!
    $take: Int!
    $filters: PasteFilterOptions
    $orderBy: PasteOrdering
  ) {
    pastes(skip: $skip, take: $take, filters: $filters, orderBy: $orderBy) {
      count
      pastes {
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
  }
`;

export const get_paste_metadata_for_user = gql`
  query GetPasteTitlesForUser(
    $userId: Int!
    $skip: Int!
    $take: Int!
    $filters: PasteFilterOptions
    $orderBy: PasteOrdering
  ) {
    user(id: $userId) {
      id
      pastes(skip: $skip, take: $take, filters: $filters, orderBy: $orderBy) {
        count
        pastes {
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
  }
`;

export const request_password_reset = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email) {
      ok
    }
  }
`;

export const reset_password = gql`
  mutation ResetPassword($token: String!, $password: String!) {
    resetPassword(token: $token, password: $password) {
      ok
    }
  }
`;

export const get_unreviewed_reports = gql`
  query GetUnreviewedReports($skip: Int!, $take: Int!) {
    count
    unreviewedPastes(skip: $skip, take: $take) {
      id
      title
      reportCount
    }
  }
`;

export const get_unreviewed_reports_count = gql`
  query GetUnreviewedReportsCount {
    count
  }
`;

export const personalize_user = gql`
  mutation PersonalizeUser(
    $id: Int!
    $username: String
    $description: String
    $avatar: UploadedAvatar
  ) {
    personalizeUser(
      id: $id
      username: $username
      description: $description
      avatar: $avatar
    ) {
      user {
        id
        username
        description
        avatar
      }
    }
  }
`;
