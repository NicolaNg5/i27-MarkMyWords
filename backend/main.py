from fastapi import FastAPI, Request
from google.generativeai import GenerativeModel
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import google.generativeai as genai
import json
import os

app = FastAPI()

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

        response = model.generate_content(contents=[file_content, selected_prompt["content"]])
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
    """Saves the selected questions to a JSON file. Modify to save into the actual database"""
    try:
        data = await request.json()
        questions = data.get("questions")

        if not questions:
            return {"error": "No questions received"}

        if not os.path.exists("questionsDtb.json"):
            with open("questionsDtb.json", "w", encoding="utf-8") as f:
                json.dump([], f, indent=3)  

        with open("questionsDtb.json", "r+", encoding="utf-8") as f:
            existing_questions = json.load(f)
            existing_questions.extend(questions)
            f.seek(0) 
            json.dump(existing_questions, f, indent=3)
            f.truncate() 

        return {"message": "Questions saved successfully!"}

    except Exception as e:
        print("Error saving questions:", e)
        return {"error": f"An error occurred: {str(e)}"}