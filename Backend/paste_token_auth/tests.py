# Standard Library
import datetime
import json

# Django
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core import mail
from django.test import TestCase
from django.urls import reverse

# 3rd-Party
import jwt
from graphene_django.utils.testing import GraphQLTestCase

# Local
from .utils import create_user, get_or_create_token, get_user_from_token

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

    def test_login_without_creds(self) -> None:
        response = self.query(
            '''
            mutation {
                loginUser( email: "", password: "") {
                    ok
                }
            }
            '''  # noqa: E501
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)

        self.assertEqual(content["errors"][0]["message"], "Invalid email or password")

    def test_logout(self) -> None:
        user = create_user(
            is_verified=True,
            username="logout_test_user",
            email="viva@la.vida",
            password="123",
        )
        token = get_or_create_token(user)

        self.client.cookies["token"] = token

        response = self.query(
            '''
            mutation {
                logoutUser {
                    ok
                }
            }
            '''  # noqa: E501
        )
        self.assertResponseNoErrors(response)
        json.loads(response.content)

        self.assertEqual(self.client.cookies.get("token").value, "")

    def test_logout_without_token(self) -> None:
        response = self.query(
            '''
            mutation {
                logoutUser {
                    ok
                }
            }
            '''  # noqa: E501
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)

        self.assertIsNone(self.client.cookies.get("token"))
        self.assertTrue(content["data"]["logoutUser"]["ok"])

    def test_create_user_with_missing_fields(self) -> None:
        response = self.query(
            '''
            mutation {
                createUser(username: "", email: "", password: "") {
                    id
                }
            }
            '''  # noqa: E501
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)

        self.assertEqual(content["errors"][0]["message"], "Missing required fields")

    def test_create_user_with_invalid_email(self) -> None:
        response = self.query(
            '''
            mutation {
                createUser(username: "awdilo", email: "invalid", password: "iojprg") {
                    id
                }
            }
            '''  # noqa: E501
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)

        self.assertEqual(content["errors"][0]["message"], "Enter a valid e-mail")

    def test_create_user_with_invalid_username(self) -> None:
        response = self.query(
            '''
            mutation {
                createUser(username: "#&$%#($&^#&", email: "a@a.a", password: "123") {
                    id
                }
            }
            '''  # noqa: E501
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)

        self.assertEqual(
            content["errors"][0]["message"],
            "Username contains restricted special characters",
        )

    def test_login_to_unverified_user(self) -> None:
        create_user(
            is_verified=False,
            username="login_test_user_unverified",
            email="a@a.a",
            password="123",
        )

        response = self.query(
            '''
            mutation {
                loginUser( email: "a@a.a", password: "123") {
                    ok
                }
            }
            '''  # noqa: E501
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)

        self.assertEqual(content["errors"][0]["message"], "Account is not verified")

    def test_token_cache_hit(self) -> None:
        user = create_user(
            is_verified=True,
            username="token_cache_test_user",
            email="sosna.to@toksinski.pl",
            password="123",
        )

        token = get_or_create_token(user)

        response = self.query(
            '''
            query {
                me {
                    id
                }
            }
            ''',  # noqa: E501
            headers={"HTTP_COOKIE": f"token={token}"},
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)

        self.assertEqual(content["data"]["me"]["id"], user.id)

        response = self.query(
            '''
            query {
                me {
                    id
                }
            }
            ''',  # noqa: E501
            headers={"HTTP_COOKIE": f"token={token}"},
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)

        self.assertEqual(content["data"]["me"]["id"], user.id)

    def test_request_password_reset(self) -> None:
        create_user(
            is_verified=True,
            username="request_password_reset_test_user",
            email="reset@me.pls",
            password="123",
        )

        response = self.query(
            '''
            mutation {
                requestPasswordReset(email: "reset@me.pls") {
                    ok
                }
            }
            '''  # noqa: E501
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)

        self.assertTrue(content["data"]["requestPasswordReset"]["ok"])
        self.assertEqual(len(mail.outbox), 1)

    def test_request_password_reset_with_invalid_email(self) -> None:
        create_user(
            is_verified=True,
            username="request_password_reset_test_user_invalid_email",
            email="dont@reset.me",
            password="123",
        )

        response = self.query(
            '''
            mutation {
                requestPasswordReset(email: "does@not.exist") {
                    ok
                }
            }
            '''  # noqa: E501
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)

        self.assertTrue(content["data"]["requestPasswordReset"]["ok"])
        self.assertEqual(len(mail.outbox), 0)

    def test_reset_password(self) -> None:
        user = create_user(
            is_verified=True,
            username="reset_password_test_user",
            email="reset@me.forreal",
            password="123",
        )

        reset_token = user.auth.create_reset_token()

        response = self.query(
            '''
            mutation {
                resetPassword(token: "%s", password: "456") {
                    ok
                }
            }
            '''
            % reset_token,  # noqa: E501
        )
        self.assertResponseNoErrors(response)

        content = json.loads(response.content)
        self.assertTrue(content["data"]["resetPassword"]["ok"])

        user.refresh_from_db()
        self.assertTrue(user.check_password("456"))

    def test_reset_password_with_invalid_token_missing_id(self) -> None:
        fake_token = jwt.encode(
            {
                "act": "reset",
                "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=10),
            },
            settings.SECRET_KEY,
            algorithm="HS256",
        )

        response = self.query(
            '''
            mutation {
                resetPassword(token: "%s", password: "456") {
                    ok
                }
            }
            '''
            % fake_token,  # noqa: E501
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)

        self.assertEqual(content["errors"][0]["message"], "Invalid token")

    def test_reset_password_with_invalid_token_wrong_act(self) -> None:
        user = create_user(
            is_verified=True,
            username="reset_password_test_user_invalid_token_wrong_signature",
            email="ffwjewhefkj@ksjbdbksbjksdf.jfejkfwejksf",
            password="123",
        )

        fake_token = jwt.encode(
            {
                "act": "wrong",
                "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=10),
                "id": user.id,
            },
            settings.SECRET_KEY + user.password,
            algorithm="HS256",
        )

        response = self.query(
            '''
            mutation {
                resetPassword(token: "%s", password: "456") {
                    ok
                }
            }
            '''
            % fake_token,  # noqa: E501
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)

        self.assertEqual(content["errors"][0]["message"], "Invalid token")

    def test_reset_password_with_invalid_token_expired(self) -> None:
        fake_token = jwt.encode(
            {
                "act": "reset",
                "exp": datetime.datetime.utcnow() - datetime.timedelta(minutes=10),
                "id": 1,
            },
            settings.SECRET_KEY,
            algorithm="HS256",
        )

        response = self.query(
            '''
            mutation {
                resetPassword(token: "%s", password: "456") {
                    ok
                }
            }
            '''
            % fake_token,  # noqa: E501
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)

        self.assertEqual(content["errors"][0]["message"], "Invalid token")

    def test_reset_password_with_invalid_token_wrong_id(self) -> None:
        fake_token = jwt.encode(
            {
                "act": "reset",
                "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=10),
                "id": 999999999999999,
            },
            settings.SECRET_KEY,
            algorithm="HS256",
        )

        response = self.query(
            '''
            mutation {
                resetPassword(token: "%s", password: "456") {
                    ok
                }
            }
            '''
            % fake_token,  # noqa: E501
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)

        self.assertEqual(content["errors"][0]["message"], "Invalid token")

    def test_reset_password_with_invalid_token_wrong_signature(self) -> None:
        user = create_user(
            is_verified=True,
            username="reset_password_test_user_invalid_token_wrong_signature",
            email="cant@touch.this",
            password="123",
        )

        fake_token = jwt.encode(
            {
                "act": "reset",
                "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=10),
                "id": user.id,
            },
            "wrong_secret",
            algorithm="HS256",
        )

        response = self.query(
            '''
            mutation {
                resetPassword(token: "%s", password: "456") {
                    ok
                }
            }
            '''
            % fake_token,  # noqa: E501
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)

        self.assertEqual(content["errors"][0]["message"], "Invalid token")

    def test_get_user_from_invalid_token(self) -> None:
        self.assertIsNone(get_user_from_token("wrong_token"))


class TestEmailVerification(TestCase):
    def test_verify_email(self) -> None:
        user = create_user(
            is_verified=False,
            username="verify_email_test_user",
            email="verified@schmerified.com",
            password="123",
        )

        token = user.auth.create_verification_token()

        response = self.client.get(reverse('verify_email', args=[token]))

        self.assertEqual(response.status_code, 302)

        user.refresh_from_db()
        self.assertTrue(user.auth.is_verified)
