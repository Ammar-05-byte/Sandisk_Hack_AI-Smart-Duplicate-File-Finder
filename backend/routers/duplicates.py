from fastapi import APIRouter, HTTPException
from models.schemas import (
    ScanRequest,
    ExactDuplicateResponse,
    ImageDuplicateResponse,
    TextDuplicateResponse,
)
from services.hash_service import find_exact_duplicates
from services.image_similarity import find_image_duplicates
from services.text_similarity import find_text_duplicates

router = APIRouter(prefix="/duplicates", tags=["duplicates"])


@router.post("/exact", response_model=ExactDuplicateResponse)
async def exact_duplicates(request: ScanRequest):
    """Find exact duplicate files using SHA256 hashing."""
    try:
        return await find_exact_duplicates(request.directory_path)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error finding duplicates: {str(e)}")


@router.post("/image", response_model=ImageDuplicateResponse)
async def image_duplicates(request: ScanRequest):
    """Find near-duplicate images using perceptual hashing."""
    try:
        return await find_image_duplicates(request.directory_path)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error finding image duplicates: {str(e)}")


@router.post("/text", response_model=TextDuplicateResponse)
async def text_duplicates(request: ScanRequest):
    """Find similar text documents using sentence embeddings."""
    try:
        return await find_text_duplicates(request.directory_path)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error finding text duplicates: {str(e)}")
