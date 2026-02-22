import os
from typing import List, Optional
from models.schemas import FileInfo, ScanResponse
from utils.helpers import get_file_info


async def scan_directory(directory_path: str) -> ScanResponse:
    """
    Recursively scan a directory and return file metadata.
    """
    if not os.path.exists(directory_path):
        raise FileNotFoundError(f"Directory not found: {directory_path}")
    if not os.path.isdir(directory_path):
        raise NotADirectoryError(f"Path is not a directory: {directory_path}")

    files: List[FileInfo] = []
    total_size = 0

    for root, dirs, filenames in os.walk(directory_path):
        # Skip hidden directories
        dirs[:] = [d for d in dirs if not d.startswith(".")]
        for filename in filenames:
            if filename.startswith("."):
                continue
            file_path = os.path.join(root, filename)
            try:
                info = get_file_info(file_path)
                files.append(info)
                total_size += info.size
            except (PermissionError, OSError):
                continue

    return ScanResponse(
        total_files=len(files),
        total_size=total_size,
        file_summary=files,
    )
