import unittest
from fastapi.testclient import TestClient
from unittest.mock import patch
import uuid
from main import app  # Ensure 'main' is the correct import

client = TestClient(app)

class BaseTestAPI(unittest.TestCase):

    def mock_supabase_response(self, mock_table, data, status_code=200):
        """Helper method to mock Supabase table response."""
        mock_response = {"data": data, "status_code": status_code}
        mock_table.return_value.select.return_value.execute.return_value = mock_response
        return mock_response

    def make_get_request(self, endpoint):
        """Helper method to make a GET request."""
        return client.get(endpoint)

    def assert_response(self, response, expected_data):
        """Helper method to assert response status and JSON."""
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected_data)


class TestAPI(BaseTestAPI):

    @patch('main.supabase.table')
    def test_get_students(self, mock_table):
        mock_data = [
            {"Studentid": "067207b7-eb56-4e06-978f-d6a419e6ca20", "name": "Student4", "email": "student4@gmail.com"},
            {"Studentid": "4e071e5a-a0cb-410d-b7a9-6a0e3409915c", "name": "Student3", "email": "user3@example.com"}
        ]
        expected_response = self.mock_supabase_response(mock_table, mock_data)

        response = self.make_get_request("/students")
        self.assert_response(response, expected_response)

    @patch('main.supabase.table')
    def test_get_student(self, mock_table):
        test_uuid = "067207b7-eb56-4e06-978f-d6a419e6ca20"
        mock_data = [{"Studentid": str(test_uuid), "name": "Student4", "email": "student4@gmail.com"}]
        expected_response = self.mock_supabase_response(mock_table, mock_data)

        response = self.make_get_request(f"/student/{test_uuid}")
        self.assert_response(response, expected_response)

    @patch('main.supabase.table')
    def test_get_classes(self, mock_table):
        mock_data = [
            {"class": "58c3c152-4da2-40b7-9463-aeb908dc34cc"},
            {"class": "25b45eb9-8c01-4872-a560-ada7d8406a02"}
        ]
        expected_response = self.mock_supabase_response(mock_table, mock_data)

        response = self.make_get_request("/classes")
        self.assert_response(response, expected_response)

    @patch('main.PROMPTS')
    def test_get_prompts(self, mock_prompts):
        mock_prompts_data = {
            '1': {'name': 'Sherlock Holmes'},
            '2': {'name': 'Romeo and Juliet'}
        }
        mock_prompts.values.return_value = mock_prompts_data.values()

        expected_response = {"prompts": ["Sherlock Holmes", "Romeo and Juliet"]}

        response = self.make_get_request("/prompts")
        self.assert_response(response, expected_response)

    @patch('main.supabase.table')
    def test_get_skills(self, mock_table):
        mock_data = [
            {"skillid": "e48659ad-fc3f-4548-85ee-c22c6d5d8e4b", "name": "Skill 1", "importance": "High"}
        ]
        expected_response = self.mock_supabase_response(mock_table, mock_data)

        response = self.make_get_request("/skills")
        self.assert_response(response, expected_response)

# get skills by ID --> not working need to be fixed
    @patch('main.supabase.table')
    def test_get_skill(self, mock_table):
        test_uuid = uuid.uuid4()
        mock_data = [{"skillid": str(test_uuid), "name": "Skill 1", "importance": "High"}]
        expected_response = self.mock_supabase_response(mock_table, mock_data)

        response = self.make_get_request(f"/skill/{test_uuid}")
        self.assert_response(response, expected_response)

    # Adding the test for /questionskills endpoint
    @patch('main.supabase.table')
    def test_get_questionskills(self, mock_table):
        mock_data = [
            {
                "QuestionID": "5c4c331b-f7cc-4b16-be71-00647ae1e403",
                "SkillID": "d9c7e6a9-6cfe-4d57-828e-0d6b5afc6f63"
            }
        ]
        expected_response = {
            "data": mock_data,
            "count": None
        }
        # Mock the Supabase table response
        mock_table.return_value.select.return_value.execute.return_value = {
            "data": mock_data,
            "count": None
        }
        # Make the GET request to the "/questionskills" endpoint
        response = self.make_get_request("/questionskills")

        # Assert that the response status code is 200
        self.assertEqual(response.status_code, 200)

        # Assert that the response matches the expected JSON structure
        self.assert_response(response, expected_response)

# not working yet
    @patch('main.supabase.table')
    def test_get_questionskills_by_id(self, mock_table):
        test_uuid = uuid.uuid4()
    
        mock_data = [{"skillid": str(test_uuid), "name": "Skill 1", "importance": "High"}]
        expected_response = self.mock_supabase_response(mock_table, mock_data)

        response = self.make_get_request(f"/skill/{test_uuid}")
        self.assert_response(response, expected_response)

if __name__ == '__main__':
    unittest.main()
