from fastapi import APIRouter, HTTPException
from models.schemas import RecommendRequest, RecommendationResponse, CleanModeResponse
from services.recommendation_engine import compute_recommendation

router = APIRouter(prefix="/recommend", tags=["recommendation"])


@router.post("", response_model=RecommendationResponse)
async def recommend(request: RecommendRequest):
    """
    Given a group of duplicate files, recommend the best one to keep.
    """
    if len(request.duplicate_group) < 2:
        raise HTTPException(status_code=400, detail="Need at least 2 files to recommend from")
    try:
        return compute_recommendation(request.duplicate_group)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation failed: {str(e)}")


@router.post("/clean", response_model=CleanModeResponse)
async def smart_clean(request: RecommendRequest):
    """
    Simulate smart clean mode: identify files to delete (lowest scoring duplicates).
    This is a SIMULATION ONLY - no files are actually deleted.
    """
    if len(request.duplicate_group) < 2:
        raise HTTPException(status_code=400, detail="Need at least 2 files to clean")
    try:
        recommendation = compute_recommendation(request.duplicate_group)
        # Files to delete = all except the recommended one
        files_to_delete = [f for f in request.duplicate_group if f.path != recommendation.recommended_file.path]
        space_freed = sum(f.size for f in files_to_delete)
        return CleanModeResponse(
            files_to_delete=files_to_delete,
            space_freed=space_freed,
            simulation=True,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Clean mode failed: {str(e)}")
