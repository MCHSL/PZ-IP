import json

from graphene_django.utils.testing import GraphQLTestCase

class MyFancyTestCase(GraphQLTestCase):
    def test_registration(self):
        response = self.query(
            '''
            mutation {
                createUser(username: "test_user", email: "test@test.com", password: "123") {
                    user {
                        id
                    }
                }
            }
            '''
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseNoErrors(response)
    
    def test_login(self):
        response = self.query(
            '''
            mutation {
                tokenAuth( email: "test@test.com", password: "123") {
                    token
                }
            }
            '''
        )

        content = json.loads(response.content)

        # This validates the status code and if you get errors
        self.assertResponseNoErrors(response)