import { gql } from '@apollo/client';

export const login = gql`
    mutation ($email: String!, $password: String!)  {
        tokenAuth(email: $email, password: $password) {
            token
        }
    }`

    export const getUsers = gql`
    query {
      users {
      id
      username
      isStaff
      email
      dateJoined
      lastLogin
      isActive
      isSuperuser
      }
    }
    `
