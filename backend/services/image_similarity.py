import os
from typing import List, Tuple, Optional
from PIL import Image
import imagehash

from models.schemas import FileInfo, ImageDuplicateGroup, ImageDuplicateResponse
from utils.helpers import get_file_info, is_image

# Hamming distance threshold for near-duplicate detection
HASH_THRESHOLD = 10


def compute_phash(image_path: str) -> Optional[imagehash.ImageHash]:
    """Compute perceptual hash of an image."""
    try:
        with Image.open(image_path) as img:
            img = img.convert("L")  # Grayscale
            return imagehash.phash(img)
    except Exception:
        return None


def detect_faces(image_path: str) -> bool:
    """
    Detect if image contains faces using a simple heuristic.
    Falls back gracefully if opencv not available.
    """
    try:
        import cv2
        img = cv2.imread(image_path)
        if img is None:
            return False
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        # Use Haar cascade if available
        cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        face_cascade = cv2.CascadeClassifier(cascade_path)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
        return len(faces) > 0
    except Exception:
        return False


def get_image_resolution(image_path: str) -> Tuple[int, int]:
    """Return (width, height) of an image."""
    try:
        with Image.open(image_path) as img:
            return img.size
    except Exception:
        return (0, 0)


async def find_image_duplicates(directory_path: str, threshold: int = HASH_THRESHOLD) -> ImageDuplicateResponse:
    """
    Find near-duplicate images using perceptual hashing.
    Groups images whose perceptual hash Hamming distance < threshold.
    """
    # Collect all images
    image_files: List[str] = []
    for root, dirs, files in os.walk(directory_path):
        dirs[:] = [d for d in dirs if not d.startswith(".")]
        for f in files:
            path = os.path.join(root, f)
            if is_image(path):
                image_files.append(path)

    # Compute hashes
    hashes: List[Tuple[str, imagehash.ImageHash]] = []
    for path in image_files:
        h = compute_phash(path)
        if h is not None:
            hashes.append((path, h))

    # Cluster by Hamming distance (greedy grouping)
    visited = set()
    groups: List[List[str]] = []

    for i, (path_i, hash_i) in enumerate(hashes):
        if path_i in visited:
            continue
        group = [path_i]
        visited.add(path_i)
        for j, (path_j, hash_j) in enumerate(hashes):
            if path_j in visited:
                continue
            distance = hash_i - hash_j
            if distance < threshold:
                group.append(path_j)
                visited.add(path_j)
        if len(group) > 1:
            groups.append(group)

    # Build response
    duplicate_groups: List[ImageDuplicateGroup] = []
    total_recoverable = 0

    for group in groups:
        file_infos = []
        for p in group:
            try:
                file_infos.append(get_file_info(p))
            except OSError:
                continue

        if len(file_infos) < 2:
            continue

        # Representative = largest resolution
        best = max(file_infos, key=lambda f: os.path.getsize(f.path))
        recoverable = sum(fi.size for fi in file_infos) - best.size
        total_recoverable += recoverable

        has_faces = any(detect_faces(fi.path) for fi in file_infos[:3])  # Check first 3 to save time

        # Calculate average similarity
        phash_vals = [compute_phash(fi.path) for fi in file_infos]
        phash_vals = [h for h in phash_vals if h is not None]
        if len(phash_vals) > 1:
            distances = []
            for a in range(len(phash_vals)):
                for b in range(a + 1, len(phash_vals)):
                    distances.append(phash_vals[a] - phash_vals[b])
            avg_distance = sum(distances) / len(distances)
            similarity = max(0.0, 1.0 - avg_distance / 64.0)
        else:
            similarity = 1.0

        duplicate_groups.append(ImageDuplicateGroup(
            representative=best,
            files=file_infos,
            similarity_score=round(similarity, 3),
            recoverable_space=recoverable,
            has_faces=has_faces,
        ))

    return ImageDuplicateResponse(
        duplicate_groups=duplicate_groups,
        recoverable_space=total_recoverable,
    )
