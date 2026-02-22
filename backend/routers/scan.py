from fastapi import APIRouter, HTTPException
from models.schemas import ScanRequest, ScanResponse
from services.file_scanner import scan_directory

router = APIRouter(prefix="/scan", tags=["scan"])


@router.post("", response_model=ScanResponse)
async def scan_endpoint(request: ScanRequest):
    """
    Recursively scan a directory and return file metadata summary.
    """
    try:
        result = await scan_directory(request.directory_path)
        return result
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except NotADirectoryError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except PermissionError:
        raise HTTPException(status_code=403, detail="Permission denied accessing directory")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scan failed: {str(e)}")
