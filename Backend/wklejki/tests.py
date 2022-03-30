# Standard Library
import json

# Django
from django.contrib.auth import get_user_model

# 3rd-Party
from graphene_django.utils.testing import GraphQLTestCase
from graphql_jwt.shortcuts import get_token


class AuthenticationTests(GraphQLTestCase):
    def test_registration_and_login(self) -> None:
        response = self.query(
            '''
            mutation {
                createUser(username: "test_user", email: "test@test.com", password: "123") {
                    user {
                        id
                    }
                }
            }
            '''  # noqa: E501
        )

        json.loads(response.content)

        self.assertResponseNoErrors(response)

        response = self.query(
            '''
            mutation {
                tokenAuth( email: "test@test.com", password: "123") {
                    token
                }
            }
            '''  # noqa: E501
        )

        json.loads(response.content)

        self.assertResponseNoErrors(response)


class UserCrudTest(GraphQLTestCase):
    def setUp(self) -> None:
        self.admin = get_user_model().objects.create(
            email="admin@ad.min",
            username="admin",
            password="admin1",
            is_superuser=True,
            is_staff=True,
        )
        self.token = get_token(self.admin)

    def test_user_crud(self) -> None:
        create_result = self.query(
            """
                mutation ($email: String!, $password: String!, $username: String!) {
                    createUser(email: $email, password: $password, username: $username) {
                        user {
                            id
                        }
                    }
                }
            """,  # noqa: E501
            variables={
                "email": "someuser@gmail.com",
                "password": "123",
                "username": "someuser",
            },
            headers={"HTTP_AUTHORIZATION": f"JWT {self.token}"},
        )
        self.assertResponseNoErrors(create_result)

        result = json.loads(create_result.content)
        user_id = int(result["data"]["createUser"]["user"]["id"])

        read_result = self.query(
            """
                query ($id: Int!) {
                    user(id: $id) {
                        id
                        email
                        username
                    }
                }
            """,  # noqa: E501
            variables={"id": user_id},
            headers={"HTTP_AUTHORIZATION": f"JWT {self.token}"},
        )
        self.assertResponseNoErrors(read_result)

        result = json.loads(read_result.content)
        self.assertEqual(result["data"]["user"]["id"], user_id)
        self.assertEqual(result["data"]["user"]["email"], "someuser@gmail.com")
        self.assertEqual(result["data"]["user"]["username"], "someuser")

        update_result = self.query(
            """
                mutation ($id: Int!, $email: String!, $username: String!) {
                    updateUser(id: $id, email: $email, username: $username) {
                        user {
                            id
                            email
                            username
                        }
                    }
                }
            """,  # noqa: E501
            variables={
                "id": user_id,
                "email": "anotheruser@gmail.com",
                "username": "anotheruser",
            },
            headers={"HTTP_AUTHORIZATION": f"JWT {self.token}"},
        )
        self.assertResponseNoErrors(update_result)

        result = json.loads(update_result.content)
        self.assertEqual(result["data"]["updateUser"]["user"]["id"], user_id)
        self.assertEqual(
            result["data"]["updateUser"]["user"]["email"], "anotheruser@gmail.com"
        )
        self.assertEqual(
            result["data"]["updateUser"]["user"]["username"], "anotheruser"
        )

        delete_result = self.query(
            """
                mutation ($id: Int!) {
                    deleteUser(id: $id) {
                        ok
                    }
                }
            """,  # noqa: E501
            variables={"id": user_id},
            headers={"HTTP_AUTHORIZATION": f"JWT {self.token}"},
        )
        self.assertResponseNoErrors(delete_result)

        result = json.loads(delete_result.content)
        self.assertEqual(result["data"]["deleteUser"]["ok"], True)

        verify_delete = self.query(
            """
                query ($id: Int!) {
                    user(id: $id) {
                        id
                    }
                }
            """,  # noqa: E501
            variables={"id": user_id},
            headers={"HTTP_AUTHORIZATION": f"JWT {self.token}"},
        )
        self.assertResponseHasErrors(verify_delete)


class PasteCrudTest(GraphQLTestCase):
    def setUp(self) -> None:
        self.user = get_user_model().objects.create(
            email="fake@email.com",
            username="test",
            password="AAAAAAA",
        )
        self.token = get_token(self.user)

    def test_paste_crud(self) -> None:
        create_result = self.query(
            """
                mutation ($title: String!, $content: String!, $isPrivate: Boolean!) {
                    createPaste(title: $title, content: $content, private: $isPrivate) {
                        paste {
                            id
                        }
                    }
                }
            """,  # noqa: E501
            variables={
                "title": "test title",
                "content": "test content",
                "isPrivate": False,
            },
            headers={"HTTP_AUTHORIZATION": f"JWT {self.token}"},
        )
        self.assertResponseNoErrors(create_result)

        result = json.loads(create_result.content)
        paste_id = int(result["data"]["createPaste"]["paste"]["id"])

        read_result = self.query(
            """
                query ($id: Int!) {
                    paste(id: $id) {
                        id
                        title
                        content
                        private
                        author {
                            id
                            username
                        }
                    }
                }
            """,  # noqa: E501
            variables={"id": paste_id},
            headers={"HTTP_AUTHORIZATION": f"JWT {self.token}"},
        )
        self.assertResponseNoErrors(read_result)

        result = json.loads(read_result.content)
        self.assertEqual(result["data"]["paste"]["id"], paste_id)
        self.assertEqual(result["data"]["paste"]["title"], "test title")
        self.assertEqual(result["data"]["paste"]["content"], "test content")
        self.assertEqual(result["data"]["paste"]["private"], False)
        self.assertEqual(result["data"]["paste"]["author"]["id"], self.user.id)
        self.assertEqual(
            result["data"]["paste"]["author"]["username"], self.user.username
        )

        update_result = self.query(
            """
                mutation ($id: Int!, $title: String!, $content: String!, $private: Boolean!) {
                    updatePaste(id: $id, title: $title, content: $content, private: $private) {
                        paste {
                            id
                            title
                            content
                            private
                        }
                    }
                }
            """,  # noqa: E501
            variables={
                "id": paste_id,
                "title": "updated title",
                "content": "updated content",
                "private": True,
            },
            headers={"HTTP_AUTHORIZATION": f"JWT {self.token}"},
        )
        self.assertResponseNoErrors(update_result)

        result = json.loads(update_result.content)
        self.assertEqual(result["data"]["updatePaste"]["paste"]["id"], paste_id)
        self.assertEqual(result["data"]["updatePaste"]["paste"]["private"], True)
        self.assertEqual(
            result["data"]["updatePaste"]["paste"]["title"], "updated title"
        )
        self.assertEqual(
            result["data"]["updatePaste"]["paste"]["content"], "updated content"
        )

        delete_result = self.query(
            """
                mutation ($id: Int!) {
                    deletePaste(id: $id) {
                        ok
                    }
                }
            """,
            variables={"id": paste_id},
            headers={"HTTP_AUTHORIZATION": f"JWT {self.token}"},
        )
        self.assertResponseNoErrors(delete_result)

        result = json.loads(delete_result.content)
        self.assertEqual(result["data"]["deletePaste"]["ok"], True)

        verify_delete = self.query(
            """
                query ($id: Int!) {
                    paste(id: $id) {
                        id
                    }
                }
            """,
            variables={"id": paste_id},
            headers={"HTTP_AUTHORIZATION": f"JWT {self.token}"},
        )
        self.assertResponseHasErrors(verify_delete)


# docker compose build && docker compose run --rm
# --entrypoint="python manage.py test" backend
