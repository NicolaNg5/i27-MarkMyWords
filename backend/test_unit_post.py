from unittest.mock import patch, mock_open
import unittest
import os
from fastapi.testclient import TestClient
from unittest.mock import patch
import uuid
from main import app  # Ensure 'main' is the correct import

class TestAPIEndpoints(unittest.TestCase):

    def setUp(self):
        # Create a test client for FastAPI app
        self.client = TestClient(app)
        self.uploads_dir = "uploads"
        self.questions_file = os.path.join(os.path.dirname(__file__), "questionsDtb.json")
        # Ensure the uploads directory exists
        os.makedirs(self.uploads_dir, exist_ok=True)

    def tearDown(self):
        # Clean up the uploads directory after each test
        for file_name in os.listdir(self.uploads_dir):
            file_path = os.path.join(self.uploads_dir, file_name)
            if os.path.isfile(file_path):
                os.remove(file_path)
        
        # Remove the questions JSON file after each test if it exists
        if os.path.exists(self.questions_file):
            os.remove(self.questions_file)

    def test_file_upload(self):
        # Simulate file content upload
        file_name = "testfile.txt"
        file_content = "This is a test file."

        body_data = f"{file_name}\n{file_content}"

        # Send a POST request to the upload endpoint
        response = self.client.post("/upload", data=body_data)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check the JSON response message
        response_json = response.json()
        self.assertIn("message", response_json)
        self.assertEqual(response_json["message"], f"File content received and saved as {file_name}")

        # Verify the file was saved correctly
        saved_file_path = os.path.join(self.uploads_dir, file_name)
        self.assertTrue(os.path.exists(saved_file_path))

        # Check the file content
        with open(saved_file_path, "r", encoding="utf-8") as f:
            saved_content = f.read()
            self.assertEqual(saved_content, file_content)

    def test_save_questions(self):
        # Simulate a POST request to save questions
        questions_data = [
            {
                "QuestionID": "9e614474-62c1-4aa2-b360-eeea1f442cbd",
                "AssessmentID": "e1aaefb7-a6ac-4243-99fc-dec3b685aab2",
                "Question": "When was Ned Kelly born",
                "Category": "Berlin",
                "Type": "Madrid",
                "Options": "Paris",
                "Answer": "multiple-choice",
            },
            {
                "question": "What is 2 + 2?",
                "option1": "3",
                "option2": "4",
                "answer": "4",
                "type": "multiple-choice",
                "category": "Math",
                "assessmentID": "12346"
            }
        ]

        # Convert questions to JSON
        body_data = json.dumps(questions_data)

        # Send a POST request to the save_questions endpoint
        response = self.client.post("/save_questions", data=body_data)

        # Check that the response status code is 201 Created
        self.assertEqual(response.status_code, 201)

        # Check the JSON response message
        response_json = response.json()
        self.assertIn("message", response_json)
        self.assertEqual(response_json["message"], "Questions saved successfully!")

        # Verify the questions were saved to the JSON file
        self.assertTrue(os.path.exists(self.questions_file))

        # Check the content of the saved questions file
        with open(self.questions_file, "r", encoding="utf-8") as f:
            saved_questions = json.load(f)
            self.assertEqual(saved_questions, questions_data)

if __name__ == "__main__":
    unittest.main()
