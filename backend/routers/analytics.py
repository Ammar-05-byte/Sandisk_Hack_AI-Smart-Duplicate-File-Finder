from fastapi import APIRouter, HTTPException, Query
from models.schemas import StorageAnalyticsResponse, StoragePredictionResponse, FileTypeDistribution
from services.storage_predictor import predict_storage_growth, get_disk_usage
from services.file_scanner import scan_directory
from services.hash_service import find_exact_duplicates
from utils.helpers import bytes_to_gb, co2_from_gb

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/storage", response_model=StorageAnalyticsResponse)
async def storage_analytics(directory: str = Query(..., description="Directory path to analyze")):
    """
    Return comprehensive storage analytics for the given directory.
    """
    try:
        scan = await scan_directory(directory)
        duplicates = await find_exact_duplicates(directory)

        # File type distribution
        type_map = {}
        for f in scan.file_summary:
            ext = f.extension or "no extension"
            if ext not in type_map:
                type_map[ext] = {"count": 0, "size": 0}
            type_map[ext]["count"] += 1
            type_map[ext]["size"] += f.size

        file_type_distribution = [
            FileTypeDistribution(type=ext, count=data["count"], size=data["size"])
            for ext, data in sorted(type_map.items(), key=lambda x: -x[1]["size"])
        ]

        recoverable_gb = bytes_to_gb(duplicates.recoverable_space)
        co2 = co2_from_gb(recoverable_gb)

        return StorageAnalyticsResponse(
            total_storage=scan.total_size,
            duplicate_storage=duplicates.recoverable_space,
            unique_storage=scan.total_size - duplicates.recoverable_space,
            file_type_distribution=file_type_distribution,
            co2_saved_kg=round(co2, 4),
            gb_recoverable=round(recoverable_gb, 3),
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analytics failed: {str(e)}")


@router.get("/predict", response_model=StoragePredictionResponse)
async def storage_prediction(directory: str = Query(..., description="Directory path to analyze")):
    """
    Predict storage growth using linear regression on historical data.
    """
    try:
        return await predict_storage_growth(directory)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
