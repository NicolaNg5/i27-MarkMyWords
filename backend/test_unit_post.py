from unittest.mock import patch, mock_open
import unittest
import os
from fastapi.testclient import TestClient
import uuid
import json
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

    # File Upload Test

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


    # Save question test 
    def test_save_questions(self):
        # Simulate a POST request to save questions
        questions_data = [
            {
                "questionID": "3a2c8d8f-2630-4089-9189-9b753bd7895c",
                "assessmentID": "1bfe83af-b9ef-43c6-9344-b202ae1be849",
                "question": "Ned Kelly was born in...",
                "category": "literal",
                "type": "FC",
                "options": "[]",
                "answer": "1850",
            },
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


    # Submit Quiz
    def test_submit_quiz(self):
        # Success Case: Prepare valid quiz data
        quiz_data = {
            "questionID": "3a2c8d8f-2630-4089-9189-9b753bd7895c",
            "answers": [
                {"question": "Ned Kelly was born in...", "answer": "1850"},
                {"question": "What is 2 + 2?", "answer": "4"}
            ]
        }

        # Act: Send a POST request to the /submit_quiz endpoint with valid data
        response = self.client.post("/submit_quiz", json=quiz_data)  

        # Assert: Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)
        # Assert: Check that the response contains the expected success message
        self.assertEqual(response.json(), {"message": "Quiz received successfully!"})

        # Error Case: Prepare invalid quiz data to trigger an exception
        invalid_quiz_data = "This is not valid JSON"

        # Act: Send a POST request to the /submit_quiz endpoint with invalid data
        response = self.client.post("/submit_quiz", data=invalid_quiz_data)  

        # Assert: Check that the response status code is 200 OK (since the exception is handled)
        self.assertEqual(response.status_code, 200)
        # Assert: Check that the response contains the expected error message
        response_json = response.json()
        self.assertIn("error", response_json)
        self.assertTrue(response_json["error"].startswith("An error occurred"))


    def test_create_student(self):
        # Simulate student data
        student_data = {
            # "Studentid":"b1df90f3-d216-4380-8697-1efbdf6cb6fc",
            "name": "John Doe",
            "email": "john.doe@example.com",
            "class_id": "25b45eb9-8c01-4872-a560-ada7d8406a02"
        }

        # Send a POST request to create a student
        response = self.client.post("/student/", json=student_data)

        # Check that the response status code is 201 Created
        self.assertEqual(response.status_code, 201)

        # Check the JSON response
        response_json = response.json()
        self.assertIn("message", response_json)
        self.assertEqual(response_json["message"], "Student created successfully")

        # Verify the student data in the response
        created_student = response_json["student"]
        self.assertEqual(created_student["name"], student_data["name"])
        self.assertEqual(created_student["email"], student_data["email"])
        self.assertEqual(created_student["class"], student_data["class_id"])
        self.assertTrue("Studentid" in created_student)  # Ensure Studentid is present


    # Create Assessment Test
    def test_create_assessment(self):
        # Simulate assessment data
        assessment_data = {
            "title": "A3 - The Solar System",
            "topic": "Reading comprehension mix test",
            "class_id": "25b45eb9-8c01-4872-a560-ada7d8406a02",  # Ensure this class_id exists in the DB
            "due_date": "2024-10-01",  # Ensure the date format is valid
            "reading_file_name": "The Solar System"
        }

        # Send a POST request to create an assessment
        response = self.client.post("/assessment/", json=assessment_data)

        # Print response for debugging (useful if test fails)
        print(response.json())

        # Check that the response status code is 201 Created
        self.assertEqual(response.status_code, 201)

        # Check the JSON response
        response_json = response.json()
        self.assertIn("message", response_json)
        self.assertEqual(response_json["message"], "Assessment created successfully")

        # Verify the assessment data in the response
        created_assessment = response_json["assessment"]
        self.assertEqual(created_assessment["Title"], assessment_data["title"])
        self.assertEqual(created_assessment["Topic"], assessment_data["topic"])
        self.assertEqual(created_assessment["Class"], assessment_data["class_id"])
        self.assertEqual(created_assessment["dueDate"], assessment_data["due_date"])
        self.assertEqual(created_assessment["ReadingFileName"], assessment_data["reading_file_name"])
        self.assertTrue("Assessmentid" in created_assessment)  # Ensure Assessmentid is present



    # Create Assessment Result Test
    def test_create_assessment_result(self):
        # Simulate valid assessment result data
        result_data = {
            "assessmentID": "25b45eb9-8c01-4872-a560-ada7d8406a02", 
            "studentID": "067207b7-eb56-4e06-978f-d6a419e6ca20",  
            "analysis": "Student performed excellently in the test.",
            "marks": 85
        }

        # Send a POST request to create an assessment result
        response = self.client.post("/assessmentResults/", json=result_data)

        # Check that the response status code is 201 Created
        self.assertEqual(response.status_code, 201)

        # Check the JSON response
        response_json = response.json()
        self.assertIn("message", response_json)
        self.assertEqual(response_json["message"], "Result created successfully")

        # Verify the result data in the response
        created_result = response_json["result"]
        self.assertEqual(created_result["AssessmentID"], result_data["assessmentID"])
        self.assertEqual(created_result["StudentID"], result_data["studentID"])
        self.assertEqual(created_result["Analysis"], result_data["analysis"])
        self.assertEqual(created_result["Marks"], result_data["marks"])
        self.assertTrue("ResultID" in created_result)  # Ensure ResultID is present

    def test_create_assessment_result_invalid_data(self):
        # Simulate invalid assessment result data (e.g., negative marks)
        result_data = {
            "assessmentID": "25b45eb9-8c01-4872-a560-ada7d8406a02",
            "studentID": "067207b7-eb56-4e06-978f-d6a419e6ca20",
            "analysis": "Student performed poorly in the test.",
            "marks": -10  # Invalid marks
        }

        # Send a POST request to create an assessment result with invalid data
        response = self.client.post("/assessmentResults/", json=result_data)

        # Check that the response status code is 422 Unprocessable Entity (validation error)
        self.assertEqual(response.status_code, 422)

        # Check the response for a validation error message
        response_json = response.json()
        self.assertIn("detail", response_json)
        self.assertTrue("Marks must be greater than or equal to 0" in str(response_json["detail"]))

    def test_create_assessment_result_missing_fields(self):
        # Simulate data with missing required fields (e.g., missing 'marks')
        result_data = {
            "assessmentID": "25b45eb9-8c01-4872-a560-ada7d8406a02",
            "studentID": "067207b7-eb56-4e06-978f-d6a419e6ca20",
            "analysis": "Student performed well in the test."
            # Missing 'marks' field, so it should not be counted 
        }

        # Send a POST request with missing required fields
        response = self.client.post("/assessmentResults/", json=result_data)

        # Check that the response status code is 422 Unprocessable Entity (validation error)
        self.assertEqual(response.status_code, 422)

        # Check the response for a validation error message
        response_json = response.json()
        self.assertIn("detail", response_json)
        self.assertTrue("field required" in str(response_json["detail"]))


if __name__ == "__main__":
    unittest.main()
