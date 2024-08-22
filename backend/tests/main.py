from fastapi import FastAPI, Request
from google.generativeai import GenerativeModel
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import google.generativeai as genai
import json

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

try:
    with open("responses.json", "r") as f:
        responses = json.load(f)
except FileNotFoundError:
    responses = []

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