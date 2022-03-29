# Standard Library
import json

# 3rd-Party
from graphene_django.utils.testing import GraphQLTestCase


class AuthenticationTests(GraphQLTestCase):
    def test_registration_and_login(self):
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

        print("")
        print(response)
        print(response.content)

        json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseNoErrors(response)

        response = self.query(
            '''
            mutation {
                tokenAuth( email: "test@test.com", password: "123") {
                    token
                }
            }
            '''
        )

        print("")
        print(response)
        print(response.content)

        json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseNoErrors(response)
