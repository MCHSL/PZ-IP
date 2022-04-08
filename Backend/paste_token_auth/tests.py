# Standard Library
import json

# Django
from django.contrib.auth import get_user_model

# 3rd-Party
from graphene_django.utils.testing import GraphQLTestCase

# Local
from .utils import create_user, get_or_create_token

User = get_user_model()


class AuthenticationTests(GraphQLTestCase):
    def test_registration(self) -> None:
        response = self.query(
            '''
            mutation {
                createUser(username: "registration_test_user", email: "hold@your.colour", password: "123") {
                    id
                }
            }
            '''  # noqa: E501
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)

        user = User.objects.get(email="hold@your.colour")

        self.assertEqual(user.username, "registration_test_user")
        self.assertEqual(user.pk, content["data"]["createUser"]["id"])
        self.assertEqual(user.auth.is_verified, False)  # type: ignore

    def test_login(self) -> None:
        user = create_user(
            is_verified=True,
            username="login_test_user",
            email="9000@miles.com",
            password="123",
        )
        expected_token = get_or_create_token(user)

        response = self.query(
            '''
            mutation {
                loginUser( email: "9000@miles.com", password: "123") {
                    ok
                }
            }
            '''  # noqa: E501
        )
        self.assertResponseNoErrors(response)
        json.loads(response.content)

        self.assertEqual(self.client.cookies.get("token").value, expected_token)

    def test_login_with_wrong_password(self) -> None:
        create_user(
            is_verified=True,
            username="login_test_user_bad_pass",
            email="badpass@login.test",
            password="123",
        )

        response = self.query(
            '''
            mutation {
                loginUser( email: "badpass@login.test", password: "1234") {
                    ok
                }
            }
            '''  # noqa: E501
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)

        self.assertEqual(content["errors"][0]["message"], "Invalid email or password")

    def test_login_with_wrong_email(self) -> None:
        create_user(
            is_verified=True,
            username="login_test_user_bad_email",
            email="bademail@login.test",
            password="123",
        )

        response = self.query(
            '''
            mutation {
                loginUser( email: "oof@hottea.yeet", password: "123") {
                    ok
                }
            }
            '''  # noqa: E501
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)

        self.assertEqual(content["errors"][0]["message"], "Invalid email or password")

    def test_login_no_existing_token(self) -> None:
        user = create_user(
            is_verified=True,
            username="login_test_user_no_token",
            email="eye@tiger.com",
            password="123",
        )

        response = self.query(
            '''
            mutation {
                loginUser( email: "eye@tiger.com", password: "123") {
                    ok
                }
            }
            '''  # noqa: E501
        )
        self.assertResponseNoErrors(response)
        json.loads(response.content)

        user.refresh_from_db()
        self.assertEqual(
            self.client.cookies.get("token").value, user.auth.token  # type: ignore
        )
