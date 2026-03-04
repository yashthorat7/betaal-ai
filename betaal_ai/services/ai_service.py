import os
import json
from google import genai
from groq import Groq
from config import settings

# Initialize Clients
groq_client = None
if settings.GROQ_API_KEY:
    try:
        groq_client = Groq(api_key=settings.GROQ_API_KEY)
    except Exception as e:
        print(f"⚠️ Error initializing Groq Client: {e}")

gemini_client = None
if settings.GEMINI_API_KEY:
    try:
        gemini_client = genai.Client(api_key=settings.GEMINI_API_KEY)
    except Exception as e:
        print(f"⚠️ Error initializing Google GenAI Client: {e}")

def generate_ai_response(prompt: str, json_mode: bool = False, fallback_response: str = None) -> str:
    """
    Tries Groq (Plan A), then Gemini (Plan B).
    If both fail, returns the fallback_response.
    """
    # 1. Try Groq
    if groq_client:
        try:
            print("🤖 Routing to Groq...")
            
            kwargs = {
                "model": "llama-3.3-70b-versatile",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 1,
                "max_completion_tokens": 1024,
                "top_p": 1,
                "stream": False,
                "stop": None
            }
            
            if json_mode:
                kwargs["response_format"] = {"type": "json_object"}

            completion = groq_client.chat.completions.create(**kwargs)
            response_text = completion.choices[0].message.content
            return response_text
        except Exception as e:
            print(f"⚠️ Groq Error: {e}. Falling back to Gemini.")

    # 2. Try Gemini
    if gemini_client:
        try:
            print("🤖 Routing to Gemini...")
            kwargs = {
                "model": "gemini-3-flash-preview",
                "contents": prompt
            }
            if json_mode:
                kwargs["generation_config"] = {"response_mime_type": "application/json"}
                
            response = gemini_client.models.generate_content(**kwargs)
            return response.text
        except Exception as e:
            print(f"⚠️ Gemini Error: {e}. Falling back to default data.")

    # 3. Fallback
    print("⚠️ Both AI providers failed or not configured. Using fallback response.")
    return fallback_response

