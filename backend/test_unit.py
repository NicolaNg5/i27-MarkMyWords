from unittest.mock import patch, mock_open
import unittest
import os
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

    # test 1 --> Get all students
    @patch('main.supabase.table')
    def test_get_students(self, mock_table):
        mock_data = [
            {"Studentid": "067207b7-eb56-4e06-978f-d6a419e6ca20", "name": "Student4", "email": "student4@gmail.com"},
            {"Studentid": "4e071e5a-a0cb-410d-b7a9-6a0e3409915c", "name": "Student3", "email": "user3@example.com"}
        ]
        expected_response = self.mock_supabase_response(mock_table, mock_data)

        response = self.make_get_request("/students")
        self.assert_response(response, expected_response)

   
    # test 2 -- Get student by id
    @patch('main.supabase.table')
    def test_get_student(self, mock_table):
        test_uuid = "067207b7-eb56-4e06-978f-d6a419e6ca20"
        
        # Mock response from supabase
        mock_data = [
            {
                "Studentid": test_uuid,
                "name": "Student4",
                "email": "student4@gmail.com",
                "class": "58c3c152-4da2-40b7-9463-aeb908dc34cc"
            }
        ]
        
        # Simulate Supabase table select().eq().execute() method
        mock_table.return_value.select.return_value.eq.return_value.execute.return_value = {
            "data": mock_data,
            "count": None
        }
        
        # Expected response to compare against
        expected_response = {
            "data": mock_data,
            "count": None
        }
        
        # Make the request to your FastAPI endpoint
        response = self.make_get_request(f"/student/{test_uuid}")
        
        # Assert that the response matches the expected structure
        self.assert_response(response, expected_response)

    # test 3 --> Get all the classes
    @patch('main.supabase.table')
    def test_get_classes(self, mock_table):
        mock_data = [
            {"class": "58c3c152-4da2-40b7-9463-aeb908dc34cc"},
            {"class": "25b45eb9-8c01-4872-a560-ada7d8406a02"}
        ]
        expected_response = self.mock_supabase_response(mock_table, mock_data)

        response = self.make_get_request("/classes")
        self.assert_response(response, expected_response)

    # test 4 --> Get prompts
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

    # test 5 --> Get all skills
    @patch('main.supabase.table')
    def test_get_skills(self, mock_table):
        mock_data = [
            {"skillid": "e48659ad-fc3f-4548-85ee-c22c6d5d8e4b", "name": "Skill 1", "importance": "High"}
        ]
        expected_response = self.mock_supabase_response(mock_table, mock_data)

        response = self.make_get_request("/skills")
        self.assert_response(response, expected_response)

#   Test 6 --> get skills by ID --> 
    @patch('main.supabase.table')
    def test_get_skill(self, mock_table):
        # Use the skillid from your JSON response example
        test_uuid = "d9c7e6a9-6cfe-4d57-828e-0d6b5afc6f63"
        
        # Mock response to match the new structure
        mock_data = [{"skillid": test_uuid, "name": "SkillA", "importance": "Normal"}]
        
        # Simulate Supabase table select().eq().execute() method
        mock_table.return_value.select.return_value.eq.return_value.execute.return_value = {
            "data": mock_data,
            "count": None
        }
        
        # Expected response to compare against
        expected_response = {
            "data": mock_data,
            "count": None
        }
        
        # Make the request to your FastAPI endpoint
        response = self.make_get_request(f"/skill/{test_uuid}")
        
        # Assert that the response matches the expected structure
        self.assert_response(response, expected_response)

    # test 7 : Get all question skills
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

    #  test 8 --> Get question skills by id : not working yet
    @patch('main.supabase.table')
    def test_get_questionskills_by_id(self, mock_table):
        # Use the QuestionID and AssessmentID from your mock response example
        question_uuid = "0b96f7c8-504f-4704-8fc6-5af3cb79fe82"
        assessment_uuid = "a3f97168-a785-496c-8631-cc03af6b4ddc"
        mock_data = [
            {
                "QuestionID": question_uuid,
                "AssessmentID": assessment_uuid,
                "Question": "What can be inferred about the narrator's emotional state from his inability to tell the story?",
                "Category": "inferential",
                "Type": "MCQ",
                "Options": [
                    "He is indifferent and detached from the story.",
                    "He is amused by the absurdity of the situation.",
                    "He is deeply frustrated and saddened by his limitations.",
                    "He is hopeful that he will one day find the right words."
                ],
                "Answer": "He is deeply frustrated and saddened by his limitations."
            }
        ]
        mock_table.return_value.select.return_value.eq.return_value.execute.return_value = {
            "data": mock_data,
            "count": None
        }
        expected_response = {
            "data": mock_data,
            "count": None
        }
        response = self.make_get_request(f"/skill/{question_uuid}")
        self.assert_response(response, expected_response)

    #test 9: get assessment file content : not working yet need to be fixed
   # Test cases can be declared here as a class attribute
    test_cases = [
        {"assessment_id": "a3f97168-a785-496c-8631-cc03af6b4ddc", "file_name": "The Dumb Man.txt", "file_content": "The Dumb Man\nby Sherwood Anderson..."},
        {"assessment_id": "b5d97168-c123-49af-8631-bb04af5c5efg", "file_name": "Another Story.txt", "file_content": "This is the content of Another Story..."}
    ]
    
    @patch('main.supabase.table')
    @patch('os.path.exists')
    @patch('builtins.open', new_callable=mock_open)
    def test_get_assessment_file_content(self, mock_open_file, mock_exists, mock_table):
        # Loop through each test case
        for case in self.test_cases:
            assessment_id = case['assessment_id']
            file_name = case['file_name']
            file_content = case['file_content']

            # Mocking the Supabase response dynamically
            mock_table.return_value.select.return_value.eq.return_value.execute.return_value = {
                "data": [{"Assessmentid": assessment_id, "ReadingFileName": file_name}]
            }

            # Mock file existence and content
            mock_exists.return_value = True
            mock_open_file.return_value.read.return_value = file_content

            # Make the GET request dynamically
            response = self.make_get_request(f"/assessment/{assessment_id}/file")

            # Expected dynamic response
            expected_response = {"file_content": file_content}

            # Assertions for response and file path
            self.assert_response(response, expected_response)
            mock_open_file.assert_called_with(os.path.join("backend", "uploads", file_name), "r", encoding="utf-8")

    # test 10 : Get question with assessment id
    @patch('main.supabase.table')
    def test_get_question(self, mock_table):
        # Mock Supabase response for valid AssessmentID
        mock_table.return_value.select.return_value.eq.return_value.execute.return_value = {
            "data": [
                {
                    "QuestionID": "2d639b49-f659-4eb8-991e-6028b482061e",
                    "AssessmentID": "a3f97168-a785-496c-8631-cc03af6b4ddc",
                    "Question": "How many men are initially in the room at the beginning of the story?",
                    "Category": "literal",
                    "Type": "MCQ",
                    "Options": ["Two", "Three", "Four", "Five"],
                    "Answer": "option2"
                },
                {
                    "QuestionID": "4e3bd64c-283f-4bbe-904b-52591c0f600b",
                    "AssessmentID": "a3f97168-a785-496c-8631-cc03af6b4ddc",
                    "Question": "What does the woman in the story crave?",
                    "Category": "literal",
                    "Type": "MCQ",
                    "Options": ["Freedom", "Revenge", "Power", "Love"],
                    "Answer": "option4"
                }
            ]
        }

        # Test valid AssessmentID
        response = client.get("/question/assessment/a3f97168-a785-496c-8631-cc03af6b4ddc")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["data"][0]["QuestionID"], "2d639b49-f659-4eb8-991e-6028b482061e")

        # Mock empty response for invalid AssessmentID
        mock_table.return_value.select.return_value.eq.return_value.execute.return_value = {"data": []}

        # Test invalid AssessmentID
        response = client.get("/question/assessment/invalid-id")
        self.assertEqual(response.status_code, 422)

if __name__ == '__main__':
    unittest.main()



