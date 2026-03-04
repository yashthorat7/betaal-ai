import httpx
import google.generativeai as genai
from config import settings
from models.extension_models import VideoResult
from typing import List

# Fallback fake videos (Plan B)
PLAN_B_VIDEOS = [
    VideoResult(
        id="jfKfPfyJRdk", 
        title="lofi hip hop radio - beats to relax/study to", 
        thumbnail="https://img.youtube.com/vi/jfKfPfyJRdk/hqdefault.jpg", 
        url="https://www.youtube.com/watch?v=jfKfPfyJRdk"
    ),
    VideoResult(
        id="5qap5aO4i9A", 
        title="lofi hip hop radio - beats to sleep/chill to", 
        thumbnail="https://img.youtube.com/vi/5qap5aO4i9A/hqdefault.jpg", 
        url="https://www.youtube.com/watch?v=5qap5aO4i9A"
    )
]

def _extract_query_with_gemini(prompt: str, topics: List[str], keywords: List[str]) -> str:
    """Uses Gemini to distill a user prompt/context into a 3-5 word YouTube search query."""
    if not settings.GEMINI_API_KEY:
        print("⚠️ Gemini API Key missing, falling back to simple query concatenation.")
        return " ".join(topics + keywords)[:50]
        
    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-pro')
        
        system_prompt = (
            "You are an assistant for a digital rehab app. Convert the user's situation into a "
            "concise 3-5 word YouTube search query to find helpful, positive, or focus-oriented videos. "
            "Respond ONLY with the search query. No quotes. No other text."
        )
        
        user_context = f"Prompt: {prompt}\nTopics: {topics}\nKeywords: {keywords}"
        response = model.generate_content(f"{system_prompt}\n\n{user_context}")
        
        query = response.text.strip().replace('"', '')
        if query:
            return query
            
    except Exception as e:
        print(f"⚠️ Gemini processing failed for youtube query: {e}")
        
    return " ".join(topics + keywords)[:50]

async def get_youtube_recommendations(prompt: str = None, topics: List[str] = [], keywords: List[str] = []) -> List[VideoResult]:
    """Fetches real YouTube videos using the YouTube Data API v3 based on a Gemini-generated query."""
    if not settings.YOUTUBE_API_KEY:
        print("⚠️ YOUTUBE_API_KEY is missing. Using Plan B Fallbacks.")
        return PLAN_B_VIDEOS

    query = _extract_query_with_gemini(prompt or "", topics, keywords)
    print(f"🔍 YouTube Search Query: '{query}'")
    
    # Use a default fallback if query is completely empty
    if not query.strip():
        query = "focus music lofi"
        
    api_url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "maxResults": 3,
        "key": settings.YOUTUBE_API_KEY
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(api_url, params=params)
            response.raise_for_status()
            data = response.json()
            
            videos = []
            for item in data.get("items", []):
                vid_id = item["id"]["videoId"]
                snippet = item["snippet"]
                # Use high thumbnail if available, otherwise default
                thumbnails = snippet["thumbnails"]
                thumb_url = thumbnails.get("high", thumbnails.get("default", {})).get("url", "")
                
                videos.append(VideoResult(
                    id=vid_id,
                    title=snippet["title"],
                    thumbnail=thumb_url,
                    url=f"https://www.youtube.com/watch?v={vid_id}"
                ))
            
            if videos:
                return videos
            else:
                print("⚠️ YouTube search returned 0 results. Using Plan B Fallbacks.")
                return PLAN_B_VIDEOS
                
    except Exception as e:
        print(f"⚠️ YouTube Data API Request Failed: {e}. Using Plan B Fallbacks.")
        return PLAN_B_VIDEOS
