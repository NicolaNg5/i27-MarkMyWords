from fastapi import FastAPI, Request
from google.generativeai import GenerativeModel
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import google.generativeai as genai
import json
import os

app = FastAPI()

API_KEY = "AIzaSyDlIgvojKuLfMr9LB1NBV2TSrJhKiX5Y6Q"  
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

try:
    with open("responses.json", "r") as f:
        RESPONSES = json.load(f)
except FileNotFoundError:
    RESPONSES = []

@app.get("/prompts")
def get_prompts():
    return {"prompts": [prompt["name"] for prompt in PROMPTS.values()]}

uploaded_file = None 

@app.post("/upload")
async def upload_file(request: Request):
    global uploaded_file
    print("Backend - Receiving File Content...")
    try:
        file_content = (await request.body()).decode("utf-8").strip()
        print("File Content:", file_content)

        if not file_content:
            return {"error": "No file content received"}

        words = file_content.split()
        file_name = '-'.join(words[:3]) + '.txt' 

        uploaded_file = file_name

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
            (p["content"] for p in PROMPTS.values() if p["name"] == prompt_key), None
        )
        if selected_prompt is None:
            return {"error": "Invalid prompt name"}

        file_path = os.path.join("uploads", uploaded_file) if uploaded_file else None
        if not file_path or not os.path.exists(file_path):
            return {"error": "No file uploaded yet."}

        with open(file_path, "r", encoding="utf-8") as f:
            file_content = f.read()

        response = model.generate_content(contents=[file_content, selected_prompt])
        response_text = response.text

        response_data = {
            "prompt": selected_prompt,
            "response": response_text, 
        }
        RESPONSES.append(response_data)
        with open("responses.json", "w", encoding="utf-8") as f:
            json.dump(RESPONSES, f, indent=3)

        return {"response": response_text}

    except Exception as e:
        print("Backend - General Error:", e)
        return {"error": f"An error occurred: {str(e)}"}