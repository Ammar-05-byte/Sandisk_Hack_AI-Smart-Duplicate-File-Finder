import os
from typing import List, Dict
from PIL import Image

from models.schemas import FileInfo, RecommendationScores, RecommendationResponse
from utils.helpers import is_image


# Folder priority keywords (higher = better)
PRIORITY_FOLDERS = {
    "desktop": 5,
    "documents": 4,
    "pictures": 4,
    "photos": 4,
    "downloads": 2,
    "temp": -2,
    "tmp": -2,
    "cache": -3,
    "trash": -5,
}

WEIGHTS = {
    "resolution": 0.3,
    "recency": 0.3,
    "folder_priority": 0.2,
    "size": 0.2,
}


def get_resolution_score(file_path: str) -> float:
    """Return normalized resolution score for images, 0 for others."""
    if not is_image(file_path):
        return 0.5  # Neutral for non-images
    try:
        with Image.open(file_path) as img:
            w, h = img.size
            return min(1.0, (w * h) / (4096 * 4096))
    except Exception:
        return 0.0


def get_recency_score(file_info: FileInfo, min_time: float, max_time: float) -> float:
    """Newer files score higher."""
    if max_time == min_time:
        return 1.0
    return (file_info.last_modified - min_time) / (max_time - min_time)


def get_folder_priority_score(file_path: str) -> float:
    """Score based on folder name keywords."""
    path_lower = file_path.lower()
    score = 0.0
    for keyword, weight in PRIORITY_FOLDERS.items():
        if keyword in path_lower:
            score += weight
    # Normalize to [0, 1]
    return max(0.0, min(1.0, (score + 5) / 10))


def get_size_score(file_info: FileInfo, min_size: int, max_size: int) -> float:
    """Larger files score higher (more data preserved)."""
    if max_size == min_size:
        return 1.0
    return (file_info.size - min_size) / (max_size - min_size)


def compute_recommendation(files: List[FileInfo]) -> RecommendationResponse:
    """
    Score each file and return the best one to keep.
    Score = weighted sum of (resolution, recency, folder_priority, size)
    """
    if not files:
        raise ValueError("No files provided for recommendation")

    min_time = min(f.last_modified for f in files)
    max_time = max(f.last_modified for f in files)
    min_size = min(f.size for f in files)
    max_size = max(f.size for f in files)

    scores_map: Dict[str, RecommendationScores] = {}

    for file in files:
        resolution = get_resolution_score(file.path)
        recency = get_recency_score(file, min_time, max_time)
        folder = get_folder_priority_score(file.path)
        size = get_size_score(file, min_size, max_size)

        total = (
            WEIGHTS["resolution"] * resolution
            + WEIGHTS["recency"] * recency
            + WEIGHTS["folder_priority"] * folder
            + WEIGHTS["size"] * size
        )

        scores_map[file.path] = RecommendationScores(
            resolution_score=round(resolution, 3),
            recency_score=round(recency, 3),
            folder_priority_score=round(folder, 3),
            size_score=round(size, 3),
            total_score=round(total, 3),
        )

    best_path = max(scores_map, key=lambda p: scores_map[p].total_score)
    recommended = next(f for f in files if f.path == best_path)

    # Check emotional importance (face detection)
    from services.image_similarity import detect_faces
    emotional = is_image(best_path) and detect_faces(best_path)

    reason_parts = []
    best_scores = scores_map[best_path]
    if best_scores.recency_score > 0.7:
        reason_parts.append("most recently modified")
    if best_scores.resolution_score > 0.7:
        reason_parts.append("highest resolution")
    if best_scores.folder_priority_score > 0.6:
        reason_parts.append("preferred folder location")
    if best_scores.size_score > 0.7:
        reason_parts.append("largest file size")
    reason = "Recommended because: " + (", ".join(reason_parts) if reason_parts else "best overall score")

    return RecommendationResponse(
        recommended_file=recommended,
        scores={path: score for path, score in scores_map.items()},
        emotional_importance=emotional,
        reason=reason,
    )
