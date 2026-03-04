import httpx
import html
from google import genai
from config import settings
from models.extension_models import VideoResult
from typing import List

# Video Blacklist (Plan B)
VIDEO_BLACKLIST = {"3O-9k5Iquxw", "voZN-qFXpQk"}

# Fallback fake videos (Plan B)
PLAN_B_VIDEOS = [
    VideoResult(
        id="iONDebHX9qk", 
        title="Quit Social Media - Your Brain Will Thank You", 
        thumbnail="https://img.youtube.com/vi/iONDebHX9qk/hqdefault.jpg", 
        url="https://www.youtube.com/watch?v=iONDebHX9qk"
    ),
    VideoResult(
        id="3E7hkPZ-HTk", 
        title="How I Broke My Phone Addiction", 
        thumbnail="https://img.youtube.com/vi/3E7hkPZ-HTk/hqdefault.jpg", 
        url="https://www.youtube.com/watch?v=3E7hkPZ-HTk"
    ),
    VideoResult(
        id="AUoVn4sEGnM", 
        title="The Deep Focus Method - 4 Hours of Flow", 
        thumbnail="https://img.youtube.com/vi/AUoVn4sEGnM/hqdefault.jpg", 
        url="https://www.youtube.com/watch?v=AUoVn4sEGnM"
    ),
    VideoResult(
        id="kc_Jq42Og7Q", 
        title="Pomodoro Technique - Science of Focus", 
        thumbnail="https://img.youtube.com/vi/kc_Jq42Og7Q/hqdefault.jpg", 
        url="https://www.youtube.com/watch?v=kc_Jq42Og7Q"
    ),
]

from services.ai_service import generate_ai_response

def _extract_query_with_ai(prompt: str, topics: List[str], keywords: List[str]) -> str:
    """Uses AI to distill a user prompt/context into a 3-5 word YouTube search query."""
    
    system_prompt = (
        "You are a mental health expert for Betaal AI. Regardless of the user's input, "
        "always generate a 5-12 word YouTube search query focused on addiction recovery, "
        "mental health therapy, or psychological wellness. "
        "Concern: {user_prompt}\n"
        "Query (KEYWORDS ONLY):"
    )
    
    full_prompt = system_prompt.format(user_prompt=prompt)
    fallback = f"{prompt[:20]} recovery" if prompt else "digital wellness tools"
    
    response_text = generate_ai_response(prompt=full_prompt, fallback_response=fallback)
    
    if response_text and response_text != fallback:
        query = response_text.strip().replace('"', '').replace("'", "")
        if query:
            print(f"✨ AI Search Query: '{query}'")
            return query
            
    return fallback

async def get_youtube_recommendations(prompt: str = None, topics: List[str] = [], keywords: List[str] = []) -> List[VideoResult]:
    """Fetches real YouTube videos using the YouTube Data API v3."""
    if not settings.YOUTUBE_API_KEY:
        print("⚠️ YOUTUBE_API_KEY is missing. Using Fallbacks.")
        return PLAN_B_VIDEOS

    query = _extract_query_with_ai(prompt or "", topics, keywords)
    
    api_url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "videoEmbeddable": "true",
        "maxResults": 4, 
        "key": settings.YOUTUBE_API_KEY
    }

    try:
        async with httpx.AsyncClient() as client:
            print(f"📡 YouTube Search API -> Query: '{query}'")
            response = await client.get(api_url, params=params)
            
            if response.status_code != 200:
                print(f"❌ YouTube API Error: {response.status_code} - {response.text}")
                return PLAN_B_VIDEOS
                
            data = response.json()
            items = data.get("items", [])
            
            if not items:
                print(f"⚠️ 0 results for: '{query}'. Using Fallbacks.")
                return PLAN_B_VIDEOS

            videos = []
            for item in items:
                vid_id = item["id"]["videoId"]
                if vid_id in VIDEO_BLACKLIST:
                    print(f"🚫 Skipping blacklisted video: {vid_id}")
                    continue
                    
                snippet = item["snippet"]
                thumb_url = snippet["thumbnails"].get("high", snippet["thumbnails"].get("default", {})).get("url", "")
                
                videos.append(VideoResult(
                    id=vid_id,
                    title=html.unescape(snippet["title"]),
                    thumbnail=thumb_url,
                    url=f"https://www.youtube.com/watch?v={vid_id}"
                ))
                
                # We only need 4 videos max.
                if len(videos) >= 4:
                    break
            
            if not videos:
                 return PLAN_B_VIDEOS

            print(f"✅ Found {len(videos)} videos.")
            return videos
                
    except Exception as e:
        print(f"⚠️ YouTube Request Failed: {e}. Using Fallbacks.")
        return PLAN_B_VIDEOS
