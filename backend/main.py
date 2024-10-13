from fastapi import FastAPI, Request, status, HTTPException
from decouple import config
from supabase import create_client, Client
from postgrest import APIError
import uuid
from uuid import UUID
from pydantic import BaseModel, EmailStr
from google.generativeai import GenerativeModel
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import google.generativeai as genai
import json
import os
from datetime import datetime
from enum import Enum
from typing import List, Optional
app = FastAPI()

#Supabase Credentials:
url = config("SUPABASE_URL")
key = config("SUPABASE_KEY")

supabase: Client = create_client(url,key)

#AI GEMINI Credentials:
API_KEY = "AIzaSyA8l6_LJc_cJzwzOVBFA2zu1z8Tg1-3zWM"
MODEL_NAME = "gemini-1.5-pro"

with open("prompts.json", "r") as f:
    PROMPTS = json.load(f)

config = {
    "temperature": 0.5,
    "top_k": 1,
    "top_p": 1,
    "max_output_tokens": 2048,
}

safety_settings = [
    {"category": HarmCategory.HARM_CATEGORY_HARASSMENT, "threshold": HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE},
    {"category": HarmCategory.HARM_CATEGORY_HATE_SPEECH, "threshold": HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE},
    {"category": HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, "threshold": HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE},
    {"category": HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, "threshold": HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE},
]

genai.configure(api_key=API_KEY)
model = GenerativeModel(
    model_name=MODEL_NAME,
    generation_config=config,
    safety_settings=safety_settings,
)

if not os.path.exists("uploads"):
    os.makedirs("uploads")
if not os.path.exists("questions"):
    os.makedirs("questions")

def save_response(response_data, prompt_name):
    file_path = None

    if prompt_name == "Analyse Reading Material":
        file_path = "analysis.json"
        response_data = {"filename": response_data.get("file_name"), "analysis": response_data.get("questions")}
    elif prompt_name == "10 Short Answers":
        file_path = "questions/shortAns.json"
        response_data = {"filename": response_data.get("file_name"), "questions": response_data.get("questions"), "category": "SA"}
    elif prompt_name == "10 Multiple Choices":
        file_path = "questions/multiChoices.json"
        response_data = {"filename": response_data.get("file_name"), "questions": response_data.get("questions"), "category": "MCQ"}
    elif prompt_name in ["10 True/False", "10 Agree/Disagree", "10 Correct/Incorrect"]:
        file_path = "questions/cards.json"
        response_data = {"filename": response_data.get("file_name"), "questions": response_data.get("questions"), "category": "FC"}
    elif prompt_name == "10 Highlight":
        file_path = "questions/highlights.json"
        response_data = {"filename": response_data.get("file_name"), "questions": response_data.get("questions"), "category": "HL"}

    if file_path:
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                existing_data = json.load(f)
        except FileNotFoundError:
            existing_data = []

        existing_data.append(response_data)

        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(existing_data, f, indent=3)

    return response_data

uploaded_file = None


#AI API endpoints
@app.get("/prompts")
def get_prompts():
    return {"prompts": [prompt["name"] for prompt in PROMPTS.values()]}

uploaded_file = None

@app.post("/upload")
async def upload_file(request: Request):
    global uploaded_file
    print("Backend - Receiving File Content...")
    try:
        body_text = (await request.body()).decode("utf-8")
        file_name, file_content = body_text.split("\n", 1)

        uploaded_file = file_name

        print("File Content:", file_content)
        print("File Name:", file_name)

        if not file_content:
            return {"error": "No file content received"}

        file_path = os.path.join("uploads", file_name)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(file_content)
        print(f"File saved to: {file_path}")

        return {"message": f"File content received and saved as {file_name}"}

    except Exception as e:
        print("Backend - General Error:", e)
        return {"error": f"An error occurred: {str(e)}"}

@app.get("/generate")
async def generate_response(prompt_key: str, assessmentId: str):
    print("Backend - Generating Response...")

    try:
        print("Prompt Key:", prompt_key)

        selected_prompt = next(
            (p for p in PROMPTS.values() if p["name"] == prompt_key), None
        )
        if selected_prompt is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="prompt not found")

        print("Retrieve file content from assessmentId..")
        file_content =  get_assessment_file_content(assessmentId)["file_content"]

        response = model.generate_content(contents=[file_content, selected_prompt["content"],
        "Determine whether the following questions are literal (answer can be found directly in the text) or inferential (require thinking and reasoning beyond the text) based on their provided answers. Output the result as a key after 'answer', like this: {...'answer': 'answer 1', 'category': 'literal/inferential'}, {...'answer': 'answer 2', 'category': 'literal/inferential'}"
        ])
        print("Raw Response Text:", response.text)

        response_text = response.text

        response_data = {
            "prompt": selected_prompt["name"],
            "questions": response_text,
            "file_name": uploaded_file,
        }

        response_final = save_response(response_data, prompt_key)

        return {"response": response_final}
    except Exception as e:
        print("Backend - General Error:", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/save_questions", status_code=status.HTTP_201_CREATED)
async def save_questions(request: Request):
    """ Saves the selected questions to a JSON file and then to the Supabase database. """
    try:
        questions_text = (await request.body()).decode("utf-8")
        print("Backend - Received Questions Text:", questions_text)

        questions = json.loads(questions_text)
        if not questions:
            return {"error": "No questions received"}

        print("Backend - Parsed Questions:", questions)

        # Save questions to local JSON file
        file_path = os.path.join(os.path.dirname(__file__), "questionsDtb.json")
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(questions, f, indent=3)

        # Save questions to Supabase database
        for question in questions:
            # Check if the question already exists
            existing_question = supabase.table("Question").select("*").eq("Question", question["Question"]).execute()
            if existing_question.data:
                print(f"Question '{question['Question']}' already exists, skipping...")
                continue

            # Insert new question into Supabase
            try:
                result = supabase.table("Question").insert(question).execute()
                if not result.data:
                    raise HTTPException(status_code=500, detail="Failed to create question")
            except APIError as e:
                if "foreign key constraint" in str(e).lower():
                    if "assessmentid" in str(e).lower():
                        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Assessment with ID {question.get('assessmentID', None)} does not exist")
                    else:
                        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Foreign key constraint failed")
                else:
                    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
            except Exception as e:
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

        return {"message": "Questions saved successfully!"}
    except Exception as e:
        print(f"Error saving questions: {e}")
        return {"error": f"An error occurred: {str(e)}"}

@app.post("/submit_quiz")
async def submit_quiz(request: Request):
    try:
        quiz_data = await request.json()
        print("Quiz Data Received:", quiz_data)

        return {"message": "Quiz received successfully!"}

    except Exception as e:
        print("Backend - General Error:", e)
        return {"error": f"An error occurred: {str(e)}"}

@app.get("/quiz")
async def get_quiz_questions():
    """Endpoint to serve demoQus.json"""
    try:
        file_path = os.path.join(os.path.dirname(__file__), "demoQuestions.json")
        with open(file_path, "r", encoding="utf-8") as f:
            questions = json.load(f)
        return {"questions": questions}
    except FileNotFoundError:
        return {"error": "demoQus.json not found"}, 404
    except Exception as e:
        print("Error loading demo questions:", e)
        return {"error": "Failed to load demo questions"}, 500


@app.get("/reading_material")
async def get_reading_material():
    """Endpoint to serve DoctorGoldsmith.txt"""
    try:
        file_path = os.path.join(os.path.dirname(__file__), "uploads", "DoctorGoldsmith.txt")
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()
        return {"text": text}
    except FileNotFoundError:
        return {"error": "File not found"}, 404
    except Exception as e:
        print("Error loading reference text:", e)
        return {"error": "Failed to load reference text"}, 500

class StudentAnswer(BaseModel):
    AnswerID: str
    QuestionID: str
    Answer: str
    StudentID: str
    AssessmentID:str

@app.post("/submit_answers")
async def submit_answers(answers_data: List[StudentAnswer]):
    try:
        print("Answers Received:", answers_data)

        # file_path = os.path.join(os.path.dirname(__file__), "stuAns.json")
        # print("Saving answers to:", file_path)
        # with open(file_path, "w", encoding="utf-8") as f:
        #     json.dump(answers_data, f, indent=3)
        for answer in answers_data:
            # Check if the answer already exists
            existing_answer = supabase.table("StudentAnswer").select("*").eq("AnswerID", answer.AnswerID).execute()
            if existing_answer.data:
                print(f"Answer '{answer.AnswerID}' already exists, skipping...")
                continue
            else:
                # use endpoint to save answers to supabase
                create_student_answer(answer)
                print(f"Answer '{answer.AnswerID}' saved successfully!")
                continue
        return {"message": "Answers received successfully!"}

    except Exception as e:
        print(f"Error saving answers: {e}")
        return {"error": f"An error occurred: {str(e)}"}

class AnalysisSchema(BaseModel):
    StudentID: str
    AssessmentID: str
    feedback: str
    strengths: str
    weaknesses: str
    literal_rating: int
    inferential_rating: int

@app.post("/analyse_answers")
async def analyse_answers(assessment_id: str):
    # get assessment reading material
    reading_material = get_assessment_file_content(assessment_id)
    reference_text = reading_material
    print("Reading Material:", reference_text)
    # get assessment questions
    try:
        result = get_assessment_questions(assessment_id)
        questions = result.data
        print("Questions:", questions)
    except Exception as e:
        print("Error getting questions:", e)
        return {"error": "Failed to get questions"}
    # get student answers
    submitted_answers: List[StudentAnswer] = []
    try:
        result = get_studentanswer_assessmentid(assessment_id)
        answers = result.data
    except Exception as e:
        print("Error getting student answers:", e)
        return {"error": "Failed to get student answers"}
    for answer in answers:
        new_answer = StudentAnswer(
            AnswerID = answer["AnswerID"],
            QuestionID = answer["QuestionID"],
            Answer = answer["Answer"],
            StudentID = answer["StudentID"],
            AssessmentID = answer["AssessmentID"]
        )
        print("adding answer:", new_answer)
        submitted_answers.append(new_answer)

    print("Submitted Answers:", submitted_answers)

    # with open("uploads/DoctorGoldsmith.txt", "r", encoding="utf-8") as f:
    #     reference_text = f.read()
    # with open("demoQuestions.json", "r", encoding="utf-8") as f:
    #     demo_questions = json.load(f)
    # with open("stuAns.json", "r", encoding="utf-8") as f:
    #         submitted_answers = json.load(f)

    #Group answers by student and assessment
    student_answers = {}
    for answer in submitted_answers:
        student_id = answer.StudentID
        assessment_id = answer.AssessmentID
        if student_id not in student_answers:
            student_answers[student_id] = {}
        if assessment_id not in student_answers[student_id]:
            student_answers[student_id][assessment_id] = []
        student_answers[student_id][assessment_id].append(answer)

    print("Analysing student answers...")
    analysis_results: List[AnalysisSchema] = []
    for student_id, assessments in student_answers.items():
        for assessment_id, answers in assessments.items():
            analysis_prompt = f"Reference Text: {reference_text}\n\n"
            for answer in answers:
                question = next((q for q in questions if q["QuestionID"] == answer.QuestionID), None)
                if question:
                    analysis_prompt += "Question: " + question['Question'] + "\n"
                    analysis_prompt += "Student Answer: " + answer.Answer + "\n"
                    analysis_prompt += "Suggested Answer: " + question['Answer'] + "\n"
            analysis_prompt += "Please provide the analysis as PLAIN TEXT but in JSON format. Begin the output with \"{\" and end with \"}\" like this: {\"analysis\": \"<your analysis of the student's reading comprehension based on their answers>\"}"

            analysis_text = ""
            while not analysis_text:
                response = model.generate_content(contents=[analysis_prompt])
                analysis = response.text
                #print(analysis)

                try:
                    #Extract analysis from JSON format
                    analysis_json = json.loads(analysis)
                    analysis_text = analysis_json.get("analysis")
                    print(analysis_text + "\n")
                except:
                    analysis_text = ""

            strength_prompt = analysis_prompt + "\nStudent's answers analysis: " + analysis + "\nWhat are the strengths of this student based on the analysis? Provide the output as PLAIN TEXT but in JSON format. Begin the output with \"{\" and end with \"}\" like this: {\"strengths\": \"strength 1, strength 2,...\"}. No yapping and just provide brief strengths. They should be about the student's reading comprehension in general and not for this specific reading material."
            weakness_prompt = analysis_prompt + "\nStudent's answers analysis: " + analysis + "\nWhat are the weaknesses of this student based on the analysis? Provide the output as PLAIN TEXT but in JSON format. Begin the output with \"{\" and end with \"}\" like this: {\"weaknesses\": \"weakness 1, weakness 2,...\"}. No yapping and just provide brief weaknesses. They should be about the student's reading comprehension in general and not for this specific reading material."

            #Extract strengths and weaknesses
            strength_text = ""
            while not strength_text:
                strength_response = model.generate_content(contents=[strength_prompt])
                strengths = strength_response.text
                #print(strengths + "\n")
                try:
                    strength_json = json.loads(strengths)
                    strength_text = strength_json.get("strengths")
                    print(f"Strengths: {strength_text}\n")
                except:
                    strength_text = ""

            weakness_text = ""
            while not weakness_text:
                weakness_response = model.generate_content(contents=[weakness_prompt])
                weaknesses = weakness_response.text
                #print(weaknesses + "\n")
                try:
                    weakness_json = json.loads(weaknesses)
                    weakness_text = weakness_json.get("weaknesses")
                    print(f"Weaknesses: {weakness_text}\n")
                except:
                    weakness_text = ""

            rating_prompt = analysis_prompt + "\nStudent's answers analysis: " + analysis + "\n Identified strengths: " + strengths + "\n Identified weaknesses: " + weaknesses + "\nFrom these analyses of the student's performance, strengths, and weaknesses, please rate the student's literal and inferential comprehension based on the given answers. Give a rating out of ten for each of literal comprehension and inferential comprehension. Note that the suggested answers will indicate a reading comprehension level of 9 to 10 out of 10. Provide the output as PLAIN TEXT but in JSON format. Begin the output with \"{\" and end with \"}\" like this: {\"literal_rating\": \"<Your rating out of 10. Just a number between 1 and 10>\", \"inferential_rating\": \"<Your rating out of 10. Just a number between 1 and 10>\"}."
            literal = ""
            inferential = ""
            while not literal and not inferential:
                rating_response = model.generate_content(contents=[rating_prompt])
                ratings = rating_response.text
                #print(ratings + "\n")
                try:
                    rating_json = json.loads(ratings)
                    literal = rating_json.get("literal_rating")
                    inferential = rating_json.get("inferential_rating")
                    print(f"Literal rating: {literal}\nInferential rating: {inferential}\n")
                except:
                    literal = ""
                    inferential = ""
            
            new_analysis = AnalysisSchema(
                StudentID = student_id,
                AssessmentID = assessment_id,
                feedback = analysis_text,
                strengths = strength_text,
                weaknesses = weakness_text,
                literal_rating = literal,
                inferential_rating = inferential
            )

            analysis_results.append(new_analysis)

    print("Analysis Results:")
    for result in analysis_results:
        create_analysis(result)
        print(result, "\n")

    return analysis_results

#--------------------------------------------------------------------------------------#

#Supabase endpoints:

#Get all students
@app.get("/students")
def get_students():
    students = supabase.table("student").select("*").execute()
    return students

#Get specific student based on UUID
@app.get("/student/{id}")
def get_student(id:UUID):
    student = supabase.table("student").select("*").eq("Studentid",id).execute()
    return student

@app.get("/class/students")
def get_class_students(class_id:UUID):
    try:
        students = supabase.table("student").select("*").eq("class",class_id).execute()
        print(students)
        return students
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

#Get all classes
@app.get("/classes")
def get_classes():
    classes = supabase.table("Class").select("*").execute()
    return classes

#Get specifc class based on UUID
@app.get("/class/{id}")
def get_class(id:UUID):
    specificClass = supabase.table("Class").select("*").eq("ClassNumber",id).execute()
    return specificClass

#Get all reading material
@app.get("/readingmaterials")
def get_reading_materials():
    reading_materials = supabase.table("ReadingMaterial").select("*").execute()
    return reading_materials

#Get specfic reading material based on UUID
@app.get("/readingmaterial/{id}")
def get_reading_material(id:UUID):
    reading_material = supabase.table("ReadingMaterial").select("*").eq("MaterialId",id).execute()
    return reading_material

#Get all assessments
@app.get("/assessments")
def get_assessments():
    assessments = supabase.table("Assessment").select("*").execute()
    return assessments

#Get specific assessment based on UUID
@app.get("/assessment/{id}")
def get_assessment(id:UUID):
    assessment = supabase.table("Assessment").select("*").eq("Assessmentid",id).execute()
    return assessment

#Get all questions
@app.get("/questions")
def get_questions():
    questions = supabase.table("Question").select("*").execute()
    return questions

#Get specific question based on UUID
@app.get("/question/{id}")
def get_question(id:UUID):
    question = supabase.table("Question").select("*").eq("QuestionID",id).execute()
    return question

#Get specific questions based on assessment id
@app.get("/question/assessment/{id}")
def get_assessment_questions(id:UUID):
    question = supabase.table("Question").select("*").eq("AssessmentID",id).execute()
    return question

#Get all skills
@app.get("/skills")
def get_skills():
    skills = supabase.table("skill").select("*").execute()
    return skills

#Get specific skill:
@app.get("/skill/{id}")
def get_skill(id:UUID):
    skill = supabase.table("skill").select("*").eq("skillid",id).execute()
    return skill

#Get all question skill:
@app.get("/questionskills")
def get_qnsk():
    qnsk = supabase.table("QuestionSkill").select("*").execute()
    return qnsk

#Get specific question skill:
@app.get("/questionskill/{id}")
def get_qnsk(id:UUID):
    qnsk = supabase.table("QuestionSkill").select("*").eq("QuestionID",id).execute()
    return qnsk

#Get all answers
@app.get("/studentanswers")
def get_answers():
    answers = supabase.table("StudentAnswer").select("*").execute()
    return answers

#Get answer based on answer id
@app.get("/studentanswerid/{answerid}")
def get_answer_answerid(answerid:UUID):
    answer = supabase.table("StudentAnswer").select("*").eq("AnswerID",answerid).execute()
    return answer

#Get answer based on student id and question id
@app.get("/studentanswer/{questionid}")
def get_studentanswer_questionid(questionid:UUID):
    answer = supabase.table("StudentAnswer").select("*").eq("QuestionID",questionid).execute()
    return answer

#Get answer based on assessmentid
@app.get("/studentanswer/assessment/{assessmentid}")
def get_studentanswer_assessmentid(assessmentid:UUID):
    answer = supabase.table("StudentAnswer").select("*").eq("AssessmentID",assessmentid).execute()
    return answer

#Get answer based on question id
@app.get("/answerquesid/{questionid}")
def get_answer_questionid(questionid:UUID):
    answer = supabase.table("Question").select("*").eq("QuestionID",questionid).execute()
    return answer

#Get all results
@app.get("/results")
def get_results():
    results = supabase.table("AssessmentResults").select("*").execute()
    return results

#Get result based on result id
@app.get("/resultid/{id}")
def get_result_resultid(id:UUID):
    result = supabase.table("AssessmentResults").select("*").eq("ResultID",id).execute()
    return result

#Get result based on student id
@app.get("/resultstudentid/{id}")
def get_result_studentid(id:UUID):
    result = supabase.table("AssessmentResults").select("*").eq("StudentID",id).execute()
    return result

#Get analysis based on assessment id
@app.get("/analysis/{id}")
def get_analysis_assessmentid(id:UUID):
    analysis = supabase.table("Analysis").select("*").eq("AssessmentID",id).execute()
    return analysis

#Create analysis
@app.post("/analysis/", status_code=status.HTTP_201_CREATED)
def create_analysis(analysis: AnalysisSchema):
    # Generate UUID for analysis id
    analysis_id = str(uuid.uuid4())

    # Prepare data
    new_analysis = {
        "AnalysisID": analysis_id,
        "StudentID": analysis.StudentID,
        "AssessmentID": analysis.AssessmentID,
        "feedback": analysis.feedback,
        "strengths": analysis.strengths,
        "weaknesses": analysis.weaknesses,
        "literal_rating": analysis.literal_rating,
        "inferential_rating": analysis.inferential_rating
    }

    # Insert new analysis into Supabase
    try:
        result = supabase.table("Analysis").insert(new_analysis).execute()

        # Check insertion
        if result.data:
            return {"message": "Analysis created successfully", "analysis": result.data[0]}
        else:
            raise HTTPException(status_code=500, detail="Failed to create analysis")
    except APIError as e:
        if "foreign key constraint" in str(e).lower():
            if "studentid" in str(e).lower():
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Student with ID {analysis.StudentID} does not exist")
            elif "assessmentid" in str(e).lower():
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Assessment with ID {analysis.AssessmentID} does not exist")
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    
    return "Analysis created successfully"
#Create student
class StudentSchema(BaseModel):
    name: str
    email: EmailStr
    class_id: str

@app.post("/student/", status_code=status.HTTP_201_CREATED)
def create_student(student:StudentSchema):
    #UUID for student id
    student_id = str(uuid.uuid4())

    #prepare data
    new_student = {
        "Studentid": student_id,
        "name": student.name,
        "email": student.email,
        "class": student.class_id
    }

    try:
        #insert new student into supa
        result = supabase.table("student").insert(new_student).execute()

        #check insertion
        if result.data:
            return {"message": "Student created successfully", "student": result.data[0]}
        else:
            raise HTTPException(status_code=500, detail="Failed to create student")
    except APIError as e:
        if "foreign key constraint" in str(e).lower():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail=f"Class with ID {student.class_id} does not exist")
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

#Create assessment:
class AssessmentSchema(BaseModel):
    title: str
    topic: str
    class_id: str
    due_date: str
    reading_file_name: str


@app.post("/assessment/", status_code=status.HTTP_201_CREATED)
def create_assessment(assessment: AssessmentSchema):
    # Generate uuid for assessmentid
    assessment_id = str(uuid.uuid4())

    # Convert due_date string to datetime object
    due_date = datetime.strptime(assessment.due_date, '%Y-%m-%d')

    # Prepare data
    new_assessment = {
        "Assessmentid": assessment_id,
        "Title": assessment.title,
        "Topic": assessment.topic,
        "Class": assessment.class_id,
        "dueDate": due_date.strftime('%Y-%m-%d'),
        "ReadingFileName": assessment.reading_file_name
    }

    try:
        # Insert new assessment into Supabase
        result = supabase.table("Assessment").insert(new_assessment).execute()
        # Check insertion
        if result.data:
            return {"message": "Assessment created successfully", "assessment": result.data[0]}
        else:
            raise HTTPException(status_code=500, detail="Failed to create assessment")
    except APIError as e:
        if "foreign key constraint" in str(e).lower():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Class with ID {assessment.class_id} does not exist")
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.put("/update_assessment")
def update_assessment(assessment_id: str, title: Optional[str] = None, topic: Optional[str] = None, due_date: Optional[str] = None):

    updated_assessment = {}

    if title:
        updated_assessment["Title"] = title

    if topic:
        updated_assessment["Topic"] = topic

    if due_date:
        try:
            formatted_due_date = datetime.strptime(due_date, '%Y-%m-%d')
            updated_assessment["dueDate"] = formatted_due_date.isoformat()
        except ValueError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid date format. Use 'YYYY-MM-DD' format")

    print("updated_assessment:", updated_assessment)

    try:
        if updated_assessment == {}:
            raise HTTPException(status_code=status.HTTP_200_OK, detail="No fields to update")
        else:
            print("Updating assessment...")
            result = supabase.table("Assessment").update(updated_assessment).eq("Assessmentid", assessment_id).execute()
            if result.data:
                return {"message": "Assessment updated successfully", "assessment": result.data[0]}
            else:
                raise HTTPException(status_code=500, detail="Failed to update assessment")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.delete("/delete_assessment")
def delete_assessment(assessment_id: str):
    try:
        result = supabase.table("Assessment").delete().eq("Assessmentid", assessment_id).execute()
        if result.data:
            return {"message": "Assessment deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Assessment not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#Retrieve file content from assessmentId
@app.get("/assessment/{assessment_id}/file")
def get_assessment_file_content(assessment_id:str):
    try:
        #retrieve assessment based on assessment_id from supa
        assessment = supabase.table("Assessment").select("*").eq("Assessmentid", assessment_id).execute()
        if not assessment.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found")
        #retrieve file name from table
        reading_file_name = assessment.data[0]['ReadingFileName']

        #creaate file path:
        file_path = os.path.join("uploads", reading_file_name)

        #Check if the file exists
        if not os.path.exists(file_path):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")

        #Retrieve file content:
        with open(file_path, "r", encoding="utf-8") as f:
            file_content = f.read()

        return {"file_content": file_content}

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# Create Assessment Result
class ResultSchema(BaseModel):
    assessmentID: str
    studentID: str
    analysis: str
    marks: int

@app.post("/assessmentResults/", status_code=status.HTTP_201_CREATED)
def create_assessmentResult(result: ResultSchema):
    result_id = str(uuid.uuid4())
    new_result = {
        "ResultID": result_id,
        "AssessmentID": result.assessmentID,
        "StudentID": result.studentID,
        "Analysis": result.analysis,
        "Marks": result.marks
    }
    try:
        result = supabase.table("AssessmentResults").insert(new_result).execute()
        if result.data:
            return {"message": "Result created successfully", "result": result.data[0]}
        else:
            raise HTTPException(status_code=500, detail="Failed to create result")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Create Class
@app.post("/class/", status_code=status.HTTP_201_CREATED)
def create_class():
    class_id = str(uuid.uuid4())
    new_class = {
        "ClassNumber": class_id,
    }
    try:
        result = supabase.table("Class").insert(new_class).execute()
        if result.data:
            return {"message": "Class created successfully", "class": result.data[0]}
        else:
            raise HTTPException(status_code=500, detail="Failed to create class")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#Create StudentAnswer
@app.post("/student_answer/", status_code=status.HTTP_201_CREATED)
def create_student_answer(student_answer: StudentAnswer):

    #Prepare data
    new_student_answer = {
        "AnswerID": student_answer.AnswerID,
        "QuestionID": student_answer.QuestionID,
        "StudentID": student_answer.StudentID,
        "Answer": student_answer.Answer,
        "AssessmentID": student_answer.AssessmentID
    }

    try:
        # Insert new student answer into Supabase
        result = supabase.table("StudentAnswer").insert(new_student_answer).execute()
    # Check insertion
        if result.data:
            return {"message": "Student answer created successfully", "student_answer": result.data[0]}
        else:
            raise HTTPException(status_code=500, detail="Failed to create student answer")
    except APIError as e:
        if "foreign key constraint" in str(e).lower():
            if "questionid" in str(e).lower():
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Question with ID {student_answer.question_id} does not exist")
            elif "studentid" in str(e).lower():
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Student with ID {student_answer.student_id} does not exist")
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

#Create skill
class SkillImportance(str, Enum):
    HIGH = "High"
    NORMAL = "Normal"
    LOW = "Low"

class SkillSchema(BaseModel):
    name: str
    importance: SkillImportance

@app.post("/skill/", status_code=status.HTTP_201_CREATED)
def create_skill(skill: SkillSchema):
    # Generate UUID for skillid
    skill_id = str(uuid.uuid4())

    # Prepare data
    new_skill = {
        "skillid": skill_id,
        "name": skill.name,
        "importance": skill.importance.value
    }

    try:
        # Insert new skill into Supabase
        result = supabase.table("skill").insert(new_skill).execute()

        # Check insertion
        if result.data:
            return {"message": "Skill created successfully", "skill": result.data[0]}
        else:
            raise HTTPException(status_code=500, detail="Failed to create skill")
    except APIError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

#Create question  skill
class QuestionSkillSchema(BaseModel):
    question_id: str
    skill_id: str
@app.post("/question_skill/", status_code=status.HTTP_201_CREATED)
def create_question_skill(question_skill: QuestionSkillSchema):
    # Prepare data
    new_question_skill = {
        "QuestionID": question_skill.question_id,
        "SkillID": question_skill.skill_id
    }

    try:
        # Insert new question skill into Supabase
        result = supabase.table("QuestionSkill").insert(new_question_skill).execute()

        # Check insertion
        if result.data:
            return {"message": "Question skill created successfully", "question_skill": result.data[0]}
        else:
            raise HTTPException(status_code=500, detail="Failed to create question skill")
    except APIError as e:
        if "foreign key constraint" in str(e).lower():
            if "questionid" in str(e).lower():
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Question with ID {question_skill.question_id} does not exist")
            elif "skillid" in str(e).lower():
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Skill with ID {question_skill.skill_id} does not exist")
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

#Create questions
class QuestionType(str, Enum):
    MCQ = "MCQ"
    FC = "FC"
    HL = "HL"
    SA = "SA"

class Category(str, Enum):
    LITERAL = "Literal"
    INFERENTIAL = "Inferential"

class QuestionSchema(BaseModel):
    AssessmentID: str
    Question: str
    Category: Category
    Type: QuestionType
    Options: List[str]
    Answer: str

@app.post("/question/", status_code=status.HTTP_201_CREATED)
def create_question(question: QuestionSchema):
    # Generate UUID for QuestionID
    question_id = str(uuid.uuid4())

    # Prepare data
    new_question = {
        "QuestionID": question_id,
        "AssessmentID": question.AssessmentID,
        "Question": question.Question,
        "Category": question.Category.value,
        "Type": question.Type.value,
        "Options": question.Options,
        "Answer": question.Answer
    }

    try:
        # Insert new question into Supabase
        result = supabase.table("Question").insert(new_question).execute()
        # Check insertion
        if result.data:
            return {"message": "Question created successfully", "question": result.data[0]}
        else:
            raise HTTPException(status_code=500, detail="Failed to create question")
    except APIError as e:
        if "foreign key constraint" in str(e).lower():
            if "assessmentid" in str(e).lower():
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Assessment with ID {question.AssessmentID} does not exist")
            else:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Foreign key constraint failed")
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))