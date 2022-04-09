# Standard Library
import json

# Django
from django.contrib.auth import get_user_model
from django.core import mail

# 3rd-Party
from graphene_django.utils.testing import GraphQLTestCase

# Project
from paste_token_auth.utils import create_user, get_or_create_token

# Local
from .models import Paste, Report

User = get_user_model()

# docker compose -f docker-compose.test.yml up --build
# --force-recreate --remove-orphans --abort-on-container-exit


class UserCrudTests(GraphQLTestCase):
    def setUp(self) -> None:
        self.admin = create_user(
            email="admin@ad.min",
            username="admin",
            password="admin1",
            is_superuser=True,
            is_staff=True,
        )
        self.admin_token = get_or_create_token(self.admin)

        self.normie = create_user(
            email="notmin@user.land",
            username="normie",
            password="normie1",
        )
        self.normie_token = get_or_create_token(self.normie)

    def test_user_create(self) -> None:
        response = self.query(
            '''
            mutation {
                createUser(username: "test_user", email: "stars@republic.one", password: "123") {
                    id
                }
            }
            ''',  # noqa
            headers={"HTTP_COOKIE": f"token={self.admin_token}"},
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)

        user = User.objects.get(email="stars@republic.one")

        self.assertEqual(user.username, "test_user")
        self.assertEqual(user.pk, content["data"]["createUser"]["id"])

        self.assertEqual(len(mail.outbox), 1)

    def test_user_create_not_staff(self) -> None:
        response = self.query(
            '''
            mutation {
                createUser(username: "test_user_create_not_staff", email: "hng@akl.d", password: "123") {
                    id
                }
            }
            ''',  # noqa
            headers={"HTTP_COOKIE": f"token={self.normie_token}"},
        )

        self.assertResponseHasErrors(response)
        content = json.loads(response.content)

        self.assertEqual(content["errors"][0]["message"], "You are already logged in")

    def test_user_create_bypass_verification(self) -> None:
        response = self.query(
            '''
            mutation {
                createUser(username: "test_user_create_bypass_verification", email: "hack@er.man", password: "123", verified: true) {
                    id
                }
            }
            ''',  # noqa
            headers={"HTTP_COOKIE": f"token={self.admin_token}"},
        )

        self.assertResponseNoErrors(response)
        content = json.loads(response.content)

        user = User.objects.get(pk=content["data"]["createUser"]["id"])
        self.assertTrue(user.auth.is_verified)  # type: ignore

    def test_user_read(self) -> None:
        user = create_user(
            username="test_user_read", email="up@get.some", password="123"
        )

        response = self.query(
            '''
            query {
                user(id: %s) {
                    id
                    username
                    email
                }
            }
            '''
            % user.pk,
            headers={"HTTP_COOKIE": f"token={self.admin_token}"},
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)

        self.assertEqual(content["data"]["user"]["id"], user.pk)
        self.assertEqual(content["data"]["user"]["username"], user.username)
        self.assertEqual(content["data"]["user"]["email"], user.email)

    def test_user_update(self) -> None:
        user = create_user(
            username="test_user_update", email="superstar@hi.fi", password="123"
        )

        response = self.query(
            '''
            mutation {
                updateUser(id: %s, username: "test_user_update_updated", email: "no@fun.allowed") {
                    user {
                        id
                        username
                        email
                    }
                }
            }
            '''  # noqa
            % user.pk,
            headers={"HTTP_COOKIE": f"token={self.admin_token}"},
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)

        user.refresh_from_db()

        self.assertEqual(user.email, "no@fun.allowed")
        self.assertEqual(user.username, "test_user_update_updated")

        self.assertEqual(content["data"]["updateUser"]["user"]["id"], user.pk)
        self.assertEqual(content["data"]["updateUser"]["user"]["email"], user.email)
        self.assertEqual(
            content["data"]["updateUser"]["user"]["username"], user.username
        )

    def test_user_update_not_logged_in(self) -> None:
        user = create_user(
            username="test_user_update_not_allowed",
            email="stay@up.weekend",
            password="123",
        )

        response = self.query(
            '''
            mutation {
                updateUser(id: %s, username: "test_user_update_not_allowed_updated", email: "bruh@jfa.fweqi") {
                    user {
                        id
                        username
                        email
                    }
                }
            }
            '''  # noqa
            % user.pk
        )

        self.assertResponseHasErrors(response)
        content = json.loads(response.content)

        self.assertEqual(
            content["errors"][0]["message"],
            "You do not have permission to perform this action",
        )

    def test_user_update_not_staff(self) -> None:
        user = create_user(
            username="test_user_update_not_staff",
            email="here@my.arms",
            password="123",
        )

        response = self.query(
            '''
            mutation {
                updateUser(id: %s, username: "test_user_update_not_staff_updated", email: "all.wanted@all.needed") {
                    user {
                        id
                        username
                        email
                    }
                }
            }
            '''  # noqa
            % user.pk,
            headers={"HTTP_COOKIE": f"token={self.normie_token}"},
        )

        self.assertResponseHasErrors(response)
        content = json.loads(response.content)

        self.assertEqual(
            content["errors"][0]["message"],
            "You do not have permission to perform this action",
        )

    def test_user_delete(self) -> None:
        user = create_user(
            username="test_user_delete", email="kylie@give.chance", password="123"
        )

        response = self.query(
            '''
            mutation {
                deleteUser(id: %s) {
                    ok
                }
            }
            '''
            % user.pk,
            headers={"HTTP_COOKIE": f"token={self.admin_token}"},
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)

        self.assertEqual(content["data"]["deleteUser"]["ok"], True)

        with self.assertRaises(User.DoesNotExist):
            User.objects.get(pk=user.pk)

    def test_user_delete_not_logged_in(self) -> None:
        user = create_user(
            username="test_user_delete_not_allowed",
            email="tell@me.why",
            password="123",
        )

        response = self.query(
            '''
            mutation {
                deleteUser(id: %s) {
                    ok
                }
            }
            '''
            % user.pk
        )

        self.assertResponseHasErrors(response)
        content = json.loads(response.content)

        self.assertEqual(
            content["errors"][0]["message"],
            "You do not have permission to perform this action",
        )

    def test_user_delete_not_staff(self) -> None:
        user = create_user(
            username="test_user_delete_not_staff",
            email="closed@her.eyes",
            password="123",
        )

        response = self.query(
            '''
            mutation {
                deleteUser(id: %s) {
                    ok
                }
            }
            '''
            % user.pk,
            headers={"HTTP_COOKIE": f"token={self.normie_token}"},
        )

        self.assertResponseHasErrors(response)
        content = json.loads(response.content)

        self.assertEqual(
            content["errors"][0]["message"],
            "You do not have permission to perform this action",
        )


class PasteCrudTests(GraphQLTestCase):
    def setUp(self) -> None:
        self.admin = create_user(
            email="admin@ad.min",
            username="admin",
            password="admin1",
            is_superuser=True,
            is_staff=True,
        )
        self.admin_token = get_or_create_token(self.admin)

        self.normie = create_user(
            email="notmin@user.land",
            username="normie",
            password="normie1",
        )
        self.normie_token = get_or_create_token(self.normie)

    def test_paste_create(self) -> None:
        response = self.query(
            '''
            mutation {
                createPaste(
                    title: "test_paste_create",
                    content: "test_paste_create_content",
                    private: false,
                    fileDelta: {added: [], removed: []}
                    ) {
                        paste {
                            id
                            title
                            content
                            private
                            author {
                                id
                            }
                        }
                    }
                }
            ''',
            headers={"HTTP_COOKIE": f"token={self.admin_token}"},
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)

        self.assertEqual(
            content["data"]["createPaste"]["paste"]["title"], "test_paste_create"
        )
        self.assertEqual(
            content["data"]["createPaste"]["paste"]["content"],
            "test_paste_create_content",
        )
        self.assertEqual(content["data"]["createPaste"]["paste"]["private"], False)
        self.assertEqual(
            content["data"]["createPaste"]["paste"]["author"]["id"], self.admin.pk
        )

    def test_paste_create_not_logged_in(self) -> None:
        response = self.query(
            '''
            mutation {
                createPaste(
                    title: "test_paste_create",
                    content: "test_paste_create_content",
                    private: false,
                    fileDelta: {added: [], removed: []}
                    ) {
                        paste {
                            id
                            title
                            content
                        }
                    }
                }
            '''
        )

        self.assertResponseHasErrors(response)
        content = json.loads(response.content)

        self.assertEqual(
            content["errors"][0]["message"],
            "You do not have permission to perform this action",
        )

    def test_paste_read(self) -> None:
        paste = Paste.objects.create(
            title="test_paste_read",
            content="test_paste_read_content",
            private=False,
            author=self.admin,
        )

        response = self.query(
            '''
            query {
                paste(id: %s) {
                    id
                    title
                    content
                    private
                }
            }
            '''
            % paste.pk
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)

        self.assertEqual(content["data"]["paste"]["id"], paste.pk)
        self.assertEqual(content["data"]["paste"]["title"], paste.title)
        self.assertEqual(content["data"]["paste"]["content"], paste.content)
        self.assertEqual(content["data"]["paste"]["private"], paste.private)

    def test_paste_update(self) -> None:
        paste = Paste.objects.create(
            title="test_paste_update",
            content="test_paste_update_content",
            private=False,
            author=self.admin,
        )

        response = self.query(
            '''
            mutation {
                updatePaste(id: %s,
                    title: "test_paste_update_updated",
                    content: "test_paste_update_updated_content",
                    private: true
                    fileDelta: {added: [], removed: []}
                ) {
                    paste {
                        id
                        title
                        content
                        private
                    }
                }
            }
            '''
            % paste.pk,
            headers={"HTTP_COOKIE": f"token={self.admin_token}"},
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)

        paste.refresh_from_db()

        self.assertEqual(paste.title, "test_paste_update_updated")
        self.assertEqual(paste.content, "test_paste_update_updated_content")
        self.assertEqual(paste.private, True)

        self.assertEqual(content["data"]["updatePaste"]["paste"]["id"], paste.pk)
        self.assertEqual(content["data"]["updatePaste"]["paste"]["title"], paste.title)
        self.assertEqual(
            content["data"]["updatePaste"]["paste"]["content"],
            paste.content,
        )
        self.assertEqual(
            content["data"]["updatePaste"]["paste"]["private"], paste.private
        )

    def test_paste_update_not_logged_in(self) -> None:
        paste = Paste.objects.create(
            title="test_paste_update",
            content="test_paste_update_content",
            private=False,
            author=self.admin,
        )

        response = self.query(
            '''
            mutation {
                updatePaste(id: %s,
                    title: "test_paste_update_updated",
                    content: "test_paste_update_updated_content",
                    private: true
                    fileDelta: {added: [], removed: []}
                ) {
                    paste {
                        id
                        title
                        content
                        private
                    }
                }
            }
            '''
            % paste.pk,
        )

        self.assertResponseHasErrors(response)
        content = json.loads(response.content)

        self.assertEqual(
            content["errors"][0]["message"],
            "You do not have permission to perform this action",
        )

    def test_update_someone_elses_paste(self) -> None:
        paste = Paste.objects.create(
            title="test_paste_update",
            content="test_paste_update_content",
            private=False,
            author=self.admin,
        )

        response = self.query(
            '''
            mutation {
                updatePaste(id: %s, title: "test_paste_update_updated", content: "test_paste_update_updated_content", private: true) {
                    paste {
                        id
                        title
                        content
                        private
                    }
                }
            }
            '''  # noqa
            % paste.pk,
            headers={"HTTP_COOKIE": f"token={self.normie_token}"},
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)

        self.assertEqual(
            content["errors"][0]["message"],
            "You are not the author of this paste",
        )

    def test_paste_delete(self) -> None:
        paste = Paste.objects.create(
            title="test_paste_delete",
            content="test_paste_delete_content",
            private=False,
            author=self.admin,
        )

        response = self.query(
            '''
            mutation {
                deletePaste(id: %s) {
                    ok
                }
            }
            '''
            % paste.pk,
            headers={"HTTP_COOKIE": f"token={self.admin_token}"},
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)

        self.assertEqual(content["data"]["deletePaste"]["ok"], True)

        with self.assertRaises(Paste.DoesNotExist):
            Paste.objects.get(pk=paste.pk)

    def test_paste_delete_not_logged_in(self) -> None:
        paste = Paste.objects.create(
            title="test_paste_delete",
            content="test_paste_delete_content",
            private=False,
            author=self.admin,
        )

        response = self.query(
            '''
            mutation {
                deletePaste(id: %s) {
                    ok
                }
            }
            '''
            % paste.pk,
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)

        self.assertEqual(
            content["errors"][0]["message"],
            "You do not have permission to perform this action",
        )

    def test_delete_someone_elses_paste(self) -> None:
        paste = Paste.objects.create(
            title="test_paste_delete",
            content="test_paste_delete_content",
            private=False,
            author=self.admin,
        )

        response = self.query(
            '''
            mutation {
                deletePaste(id: %s) {
                    ok
                }
            }
            '''
            % paste.pk,
            headers={"HTTP_COOKIE": f"token={self.normie_token}"},
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)

        self.assertEqual(
            content["errors"][0]["message"],
            "You do not have permission to delete this paste",
        )

    def test_paste_delete_not_found(self) -> None:
        response = self.query(
            '''
            mutation {
                deletePaste(id: 420) {
                    ok
                }
            }
            ''',
            headers={"HTTP_COOKIE": f"token={self.admin_token}"},
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)

        self.assertEqual(
            content["errors"][0]["message"],
            "Paste matching query does not exist.",
        )

    def test_delete_normie_paste_as_admin(self) -> None:
        paste = Paste.objects.create(
            title="test_paste_delete",
            content="test_paste_delete_content",
            private=False,
            author=self.normie,
        )

        response = self.query(
            '''
            mutation {
                deletePaste(id: %s) {
                    ok
                }
            }
            '''
            % paste.pk,
            headers={"HTTP_COOKIE": f"token={self.admin_token}"},
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)

        self.assertEqual(content["data"]["deletePaste"]["ok"], True)

        with self.assertRaises(Paste.DoesNotExist):
            Paste.objects.get(pk=paste.pk)


class ReportTests(GraphQLTestCase):
    def setUp(self) -> None:
        self.admin = create_user(
            email="admin@ad.min",
            username="admin",
            password="admin1",
            is_superuser=True,
            is_staff=True,
        )
        self.admin_token = get_or_create_token(self.admin)

        self.normie = create_user(
            email="normie@nor.mie",
            username="normie",
            password="normie1",
        )
        self.normie_token = get_or_create_token(self.normie)

    def test_report_paste(self) -> None:
        paste = Paste.objects.create(
            title="test_report_paste",
            content="test_report_paste_content",
            private=False,
            author=self.admin,
        )

        response = self.query(
            '''
            mutation {
                reportPaste(id: %s, reason: "test_report_paste_reason") {
                    ok
                }
            }
            '''
            % paste.pk,
            headers={"HTTP_COOKIE": f"token={self.admin_token}"},
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)

        self.assertEqual(content["data"]["reportPaste"]["ok"], True)

        paste.refresh_from_db()

        reports = paste.reports.all()
        self.assertEqual(len(reports), 1)
        report = reports[0]
        self.assertEqual(report.paste, paste)
        self.assertEqual(report.reason, "test_report_paste_reason")
        self.assertEqual(report.reporter, self.admin)

    def test_get_reports_when_there_are_none(self) -> None:
        paste = Paste.objects.create(
            title="test_get_reports_for_paste",
            content="test_get_reports_for_paste_content",
            private=False,
            author=self.admin,
        )

        response = self.query(
            '''
            query {
                 paste(id: %s) {
                    reports {
                        reason
                        reporter {
                            username
                        }
                    }
                }
            }
            '''
            % paste.pk,
            headers={"HTTP_COOKIE": f"token={self.admin_token}"},
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)

        self.assertEqual(len(content["data"]["paste"]["reports"]), 0)

    def test_get_reports_for_paste(self) -> None:
        paste = Paste.objects.create(
            title="test_get_reports_for_paste",
            content="test_get_reports_for_paste_content",
            private=False,
            author=self.admin,
        )
        report = Report.objects.create(
            paste=paste,
            reason="test_get_reports_for_paste_reason",
            reporter=self.admin,
        )

        response = self.query(
            '''
            query {
                paste(id: %s) {
                    reports {
                        reason
                        reporter {
                            username
                        }
                    }
                }
            }
            '''
            % paste.pk,
            headers={"HTTP_COOKIE": f"token={self.admin_token}"},
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)

        self.assertEqual(len(content["data"]["paste"]["reports"]), 1)
        returned_report = content["data"]["paste"]["reports"][0]
        self.assertEqual(returned_report["reason"], report.reason)
        self.assertEqual(
            returned_report["reporter"]["username"], report.reporter.username
        )

    def test_report_paste_not_logged_in(self) -> None:
        paste = Paste.objects.create(
            title="test_report_paste",
            content="test_report_paste_content",
            private=False,
            author=self.admin,
        )

        response = self.query(
            '''
            mutation {
                reportPaste(id: %s, reason: "test_report_paste_reason") {
                    ok
                }
            }
            '''
            % paste.pk,
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)

        self.assertEqual(
            content["errors"][0]["message"],
            "You do not have permission to perform this action",
        )

    def test_report_paste_not_found(self) -> None:
        response = self.query(
            '''
            mutation {
                reportPaste(id: 420, reason: "test_report_paste_reason") {
                    ok
                }
            }
            ''',
            headers={"HTTP_COOKIE": f"token={self.admin_token}"},
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)

        self.assertEqual(
            content["errors"][0]["message"],
            "Paste matching query does not exist.",
        )

    def test_delete_report(self) -> None:
        paste = Paste.objects.create(
            title="test_report_paste",
            content="test_report_paste_content",
            private=False,
            author=self.admin,
        )
        report = Report.objects.create(
            paste=paste,
            reason="test_report_paste_reason",
            reporter=self.admin,
        )

        response = self.query(
            '''
            mutation {
                deleteReport(id: %s) {
                    ok
                }
            }
            '''
            % report.pk,
            headers={"HTTP_COOKIE": f"token={self.admin_token}"},
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)

        self.assertEqual(content["data"]["deleteReport"]["ok"], True)

        with self.assertRaises(Report.DoesNotExist):
            Report.objects.get(pk=report.pk)

    def test_delete_report_not_logged_in(self) -> None:
        paste = Paste.objects.create(
            title="test_report_paste",
            content="test_report_paste_content",
            private=False,
            author=self.admin,
        )
        report = Report.objects.create(
            paste=paste,
            reason="test_report_paste_reason",
            reporter=self.admin,
        )

        response = self.query(
            '''
            mutation {
                deleteReport(id: %s) {
                    ok
                }
            }
            '''
            % report.pk,
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)

        self.assertEqual(
            content["errors"][0]["message"],
            "You do not have permission to perform this action",
        )

    def test_delete_report_as_normie(self) -> None:
        paste = Paste.objects.create(
            title="test_report_paste",
            content="test_report_paste_content",
            private=False,
            author=self.admin,
        )
        report = Report.objects.create(
            paste=paste,
            reason="test_report_paste_reason",
            reporter=self.admin,
        )

        response = self.query(
            '''
            mutation {
                deleteReport(id: %s) {
                    ok
                }
            }
            '''
            % report.pk,
            headers={"HTTP_COOKIE": f"token={self.normie_token}"},
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)

        self.assertEqual(
            content["errors"][0]["message"],
            "You do not have permission to perform this action",
        )

    def test_delete_report_not_found(self) -> None:
        response = self.query(
            '''
            mutation {
                deleteReport(id: 420) {
                    ok
                }
            }
            ''',
            headers={"HTTP_COOKIE": f"token={self.admin_token}"},
        )
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)

        self.assertEqual(
            content["errors"][0]["message"],
            "Report matching query does not exist.",
        )

    def test_mark_all_reports(self) -> None:
        paste = Paste.objects.create(
            title="test_report_paste",
            content="test_report_paste_content",
            private=False,
            author=self.admin,
        )
        paste2 = Paste.objects.create(
            title="test_report_paste2",
            content="test_report_paste_content2",
            private=False,
            author=self.admin,
        )

        report = Report.objects.create(
            paste=paste,
            reason="test_report_paste_reason",
            reporter=self.admin,
        )
        report2 = Report.objects.create(
            paste=paste,
            reason="test_report_paste_reason",
            reporter=self.admin,
        )
        unrelated_report = Report.objects.create(
            paste=paste2,
            reason="test_report_paste_reason",
            reporter=self.admin,
        )

        response = self.query(
            '''
            mutation {
                deleteAllReports(id: %s) {
                    ok
                }
            }
            '''
            % paste.pk,
            headers={"HTTP_COOKIE": f"token={self.admin_token}"},
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)

        self.assertEqual(content["data"]["deleteAllReports"]["ok"], True)

        with self.assertRaises(Report.DoesNotExist):
            Report.objects.get(pk=report.pk)
        with self.assertRaises(Report.DoesNotExist):
            Report.objects.get(pk=report2.pk)

        self.assertIsNotNone(Report.objects.get(pk=unrelated_report.pk))
