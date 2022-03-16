import { gql } from '@apollo/client';

export const login = gql`
    mutation ($email: String!, $password: String!)  {
        tokenAuth(email: $email, password: $password) {
            token
        }
    }`

export const get_users = gql`
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

export const delete_user = gql`
    mutation ($id: Int!)  {
        deleteUser(id: $id) {
            ok
        }
    }`

export const create_user = gql`
    mutation ($email: String!, $password: String! $username: String!)  {
        createUser(email: $email, password: $password, username: $username) {
            user {
                id
                username
            }
        }
    }`

export const update_user = gql`
    mutation ($id: Int, $email: String, $username: String, $isStaff: Boolean)  {
        updateUser(id: $id, email: $email, username: $username, isStaff: $isStaff) {
            user {
                id
                username
                email
                isStaff
            }
        }
    }`

export const get_current_user = gql`
    query {
        me {
            id
            username
        }
    }
    `