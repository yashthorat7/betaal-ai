from fastapi import APIRouter
from models.extension_models import YoutubeRecommendRequest, YoutubeRecommendResponse
from services.youtube_service import get_youtube_recommendations

router = APIRouter(tags=["YouTube Recommendations"])

@router.post("/youtube/recommend", response_model=YoutubeRecommendResponse)
async def fetch_youtube_recommendations(request: YoutubeRecommendRequest):
    videos = await get_youtube_recommendations(
        prompt=request.prompt,
        topics=request.topics,
        keywords=request.keywords
    )
    return YoutubeRecommendResponse(videos=videos)
