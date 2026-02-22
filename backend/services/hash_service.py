import hashlib
import os
from typing import Dict, List
from models.schemas import FileInfo, DuplicateGroup, ExactDuplicateResponse
from utils.helpers import get_file_info


def compute_sha256(file_path: str, chunk_size: int = 8192) -> str:
    """Compute SHA256 hash of a file efficiently using chunked reading."""
    sha256 = hashlib.sha256()
    with open(file_path, "rb") as f:
        while chunk := f.read(chunk_size):
            sha256.update(chunk)
    return sha256.hexdigest()


async def find_exact_duplicates(directory_path: str) -> ExactDuplicateResponse:
    """
    Find exact duplicate files using two-pass approach:
    1. Group files by size (quick filter)
    2. Compute SHA256 for same-size groups
    """
    # Step 1: Group by size
    size_map: Dict[int, List[str]] = {}
    for root, dirs, files in os.walk(directory_path):
        dirs[:] = [d for d in dirs if not d.startswith(".")]
        for filename in files:
            if filename.startswith("."):
                continue
            path = os.path.join(root, filename)
            try:
                size = os.path.getsize(path)
                if size == 0:
                    continue
                size_map.setdefault(size, []).append(path)
            except OSError:
                continue

    # Step 2: Hash candidates (files sharing same size)
    hash_map: Dict[str, List[str]] = {}
    for size, paths in size_map.items():
        if len(paths) < 2:
            continue
        for path in paths:
            try:
                h = compute_sha256(path)
                hash_map.setdefault(h, []).append(path)
            except (OSError, PermissionError):
                continue

    # Step 3: Build result groups
    duplicate_groups: List[DuplicateGroup] = []
    total_recoverable = 0

    for hash_val, paths in hash_map.items():
        if len(paths) < 2:
            continue
        file_infos = []
        for p in paths:
            try:
                file_infos.append(get_file_info(p))
            except OSError:
                continue
        if len(file_infos) < 2:
            continue

        # Recoverable = (n-1) * size (keep one copy)
        recoverable = file_infos[0].size * (len(file_infos) - 1)
        total_recoverable += recoverable

        duplicate_groups.append(DuplicateGroup(
            hash=hash_val,
            files=file_infos,
            recoverable_space=recoverable,
        ))

    return ExactDuplicateResponse(
        duplicate_groups=duplicate_groups,
        recoverable_space=total_recoverable,
        total_duplicate_files=sum(len(g.files) - 1 for g in duplicate_groups),
    )
