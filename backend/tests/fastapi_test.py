from fastapi import FastAPI, Request
import json

app = FastAPI()

@app.post("/generate")
async def generate_response(request: Request):
    print("Backend - Received Request Body:", await request.body())
    try:
        data = await request.json()
        prompt_key = data.get("promptKey")
        print("Backend - Parsed Prompt Key:", prompt_key)
        return {"message": "Success"}
    except json.JSONDecodeError as e:
        print("Backend - JSON Decode Error:", e)
        return {"error": "Invalid JSON data in request body"}
    except Exception as e:
        print("Backend - General Error:", e)
        return {"error": f"An error occurred: {str(e)}"}