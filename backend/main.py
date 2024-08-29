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
    "temperature": 0.9,
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

try:
    with open("responses.json", "r") as f:
        responses = json.load(f)
except FileNotFoundError:
    responses = []


#AI API endpoints
@app.get("/prompts")
def get_prompts():
    return {"prompts": [prompt["name"] for prompt in PROMPTS.values()]}

@app.post("/generate")
async def generate_response(request: Request):
    print("Backend - Received Request Body:", await request.body())  
    try:
        prompt_key = await request.body()
        prompt_key = prompt_key.decode("utf-8")
        print("Backend - Parsed Prompt Key:", prompt_key)

        selected_prompt = next((p["content"] for p in PROMPTS.values() if p["name"] == prompt_key), None)
        if selected_prompt is None:
            return {"error": "Invalid prompt name"}

        response = model.generate_content(contents=[selected_prompt])
        response_text = response.text

        response_data = {
            "prompt": selected_prompt,
            "response": response_text,
        }

        responses.append(response_data)  
        
        with open("responses.json", "w") as f:
            json.dump(responses, f, indent=3)  

        return {"response": response_text}
    
    except Exception as e:
        print("Backend - General Error:", e)
        return {"error": f"An error occurred: {str(e)}"}
    
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
    