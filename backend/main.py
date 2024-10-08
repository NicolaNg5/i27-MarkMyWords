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
from datetime import date
from datetime import datetime
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
        response_data = {"filename": response_data.get("file_name"), "analysis": response_data.get("response")}
    elif prompt_name == "10 Short Answers":
        file_path = "questions/shortAns.json"
        response_data = {"filename": response_data.get("file_name"), "questions": response_data.get("response")}
    elif prompt_name == "10 Multiple Choices":
        file_path = "questions/multiChoices.json"
        response_data = {"filename": response_data.get("file_name"), "questions": response_data.get("response")}
    elif prompt_name in ["10 True/False", "10 Agree/Disagree", "10 Correct/Incorrect"]:
        file_path = "questions/cards.json"
        response_data = {"filename": response_data.get("file_name"), "questions": response_data.get("response")}
    elif prompt_name == "10 Highlight":
        file_path = "questions/highlights.json"
        response_data = {"filename": response_data.get("file_name"), "questions": response_data.get("response")}

    if file_path:
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                existing_data = json.load(f)
        except FileNotFoundError:
            existing_data = []

        existing_data.append(response_data)

        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(existing_data, f, indent=3)

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

@app.post("/generate")
async def generate_response(request: Request):
    global uploaded_file 
    print("Backend - Generating Response...")
    try:
        prompt_key = (await request.body()).decode("utf-8")
        print("Prompt Key:", prompt_key)

        selected_prompt = next(
            (p for p in PROMPTS.values() if p["name"] == prompt_key), None
        )
        if selected_prompt is None:
            return {"error": "Invalid prompt name"}

        file_path = os.path.join("uploads", uploaded_file) if uploaded_file else None
        if not file_path or not os.path.exists(file_path):
            return {"error": "No file uploaded yet."}

        with open(file_path, "r", encoding="utf-8") as f:
            file_content = f.read()

        response = model.generate_content(contents=[file_content, selected_prompt["content"], 
        "Determine whether the following questions are literal (answer can be found directly in the text) or inferential (require thinking and reasoning beyond the text) based on their provided answers. Output the result as a key after 'answer', like this: {...'answer': 'answer 1', 'category': 'literal/inferential'}, {...'answer': 'answer 2', 'category': 'literal/inferential'}"
        ])
        print("Raw Response Text:", response.text) 
        
        response_text = response.text

        response_data = {
            "prompt": selected_prompt["name"],
            "response": response_text,
            "file_name": uploaded_file,
        }

        save_response(response_data, prompt_key) 

        return {"response": response_text}
    except Exception as e:
        print("Backend - General Error:", e)
        return {"error": f"An error occurred: {str(e)}"} 
    
@app.post("/save_questions")
async def save_questions(request: Request):
    """
    Saves the selected questions to a JSON file. 
    Modify to save into the actual database.
    For Tom and Nicola.
    """
    try:
        questions_text = (await request.body()).decode("utf-8")

        print("Backend - Received Questions Text:", questions_text)

        questions = json.loads(questions_text)

        if not questions:
            return {"error": "No questions received"}

        print("Backend - Parsed Questions:", questions)

        file_path = os.path.join(os.path.dirname(__file__), "questionsDtb.json")

        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(questions, f, indent=3)

        return {"message": "Questions saved successfully!"}

    except Exception as e:
        print("Error saving questions:", e)
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
    ansID: str
    questionID: str 
    answer: str 
    studentID: str
    assessmentID: str
    
@app.post("/submit_answers")
async def submit_answers(request: Request):
    try:
        answers_data: List[StudentAnswer] = await request.json()
        print("Answers Received:", answers_data)  

        file_path = os.path.join(os.path.dirname(__file__), "stuAns.json") 
        print("Saving answers to:", file_path) 
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(answers_data, f, indent=3)

        
        return {"message": "Answers received successfully!"}

    except Exception as e:
        print("Backend - General Error:", e)
        return {"error": f"An error occurred: {str(e)}"}
    
    
@app.post("/analyse_answers")
async def analyse_answers():
    with open("uploads/DoctorGoldsmith.txt", "r", encoding="utf-8") as f:
        reference_text = f.read()
    with open("demoQuestions.json", "r", encoding="utf-8") as f:
        demo_questions = json.load(f)
    with open("stuAns.json", "r", encoding="utf-8") as f:
            submitted_answers = json.load(f)
    
    #Group answers by student and assessment
    student_answers = {}
    for answer in submitted_answers:
        student_id = answer["studentID"]
        assessment_id = answer["assessmentID"]
        if student_id not in student_answers:
            student_answers[student_id] = {}
        if assessment_id not in student_answers[student_id]:
            student_answers[student_id][assessment_id] = []
        student_answers[student_id][assessment_id].append(answer)

    analysis_results = []
    for student_id, assessments in student_answers.items():
        for assessment_id, answers in assessments.items():
            analysis_prompt = f"Reference Text: {reference_text}\n\n"
            for answer in answers:
                question = next((q for q in demo_questions if q["id"] == answer["questionID"]), None)
                if question:
                    analysis_prompt += "Question: " + question['question'] + "\n"
                    analysis_prompt += "Student Answer: " + answer['answer'] + "\n"
                    analysis_prompt += "Suggested Answer: " + question['answer'] + "\n"
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

            analysis_results.append({
                "studentID": student_id,
                "assessmentID": assessment_id,
                "feedback": analysis_text,
                "strengths": strength_text,
                "weaknesses": weakness_text,
                "literal_rating:": literal,
                "inferential_rating": inferential
            })

    print("Analysis Results:")
    for result in analysis_results:
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
@app.get("/answers")
def get_answers():
    answers = supabase.table("Answer").select("*").execute()
    return answers

#Get answer based on answer id
@app.get("/answerid/{answerid}")
def get_answer_answerid(answerid:UUID):
    answer = supabase.table("Answer").select("*").eq("AnswerID",answerid).execute()
    return answer

#Get answer based on question id
@app.get("/answerquesid/{questionid}")
def get_answer_questionid(questionid:UUID):
    answer = supabase.table("Answer").select("*").eq("QuestionID",questionid).execute()
    return answer

#Get all results
@app.get("/results")
def get_results():
    results = supabase.table("Results").select("*").execute()
    return results

#Get result based on result id
@app.get("/resultid/{id}")
def get_result_resultid(id:UUID):
    result = supabase.table("Results").select("*").eq("ResultID",id).execute()
    return result

#Get result based on student id
@app.get("/resultstudentid/{id}")
def get_result_studentid(id:UUID):
    result = supabase.table("Results").select("*").eq("StudentID",id).execute()
    return result

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
    due_date = datetime.strptime(assessment.due_date, '%m/%d/%Y')

    # Prepare data
    new_assessment = {
        "Assessmentid": assessment_id,
        "Title": assessment.title,
        "Topic": assessment.topic,
        "Class": assessment.class_id,
        "dueDate": due_date.strftime('%m/%d/%Y'),
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