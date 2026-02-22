import os
from typing import List, Optional
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from models.schemas import FileInfo, TextDuplicateGroup, TextDuplicateResponse
from utils.helpers import get_file_info, is_text_document

# Similarity threshold
SIMILARITY_THRESHOLD = 0.85
MODEL_NAME = "all-MiniLM-L6-v2"

# Lazy load model
_model = None


def get_model():
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer(MODEL_NAME)
    return _model


def read_text_file(path: str, max_chars: int = 5000) -> Optional[str]:
    """Read text file content with encoding fallback."""
    for encoding in ["utf-8", "latin-1", "cp1252"]:
        try:
            with open(path, "r", encoding=encoding) as f:
                content = f.read(max_chars)
                if content.strip():
                    return content
        except (UnicodeDecodeError, OSError):
            continue
    return None


async def find_text_duplicates(directory_path: str, threshold: float = SIMILARITY_THRESHOLD) -> TextDuplicateResponse:
    """
    Find similar text documents using sentence embeddings + cosine similarity.
    """
    # Collect text files
    text_files: List[str] = []
    for root, dirs, files in os.walk(directory_path):
        dirs[:] = [d for d in dirs if not d.startswith(".")]
        for f in files:
            path = os.path.join(root, f)
            if is_text_document(path):
                text_files.append(path)

    if len(text_files) < 2:
        return TextDuplicateResponse(duplicate_groups=[], recoverable_space=0)

    # Read content
    contents: List[str] = []
    valid_paths: List[str] = []
    for path in text_files:
        content = read_text_file(path)
        if content:
            contents.append(content)
            valid_paths.append(path)

    if len(valid_paths) < 2:
        return TextDuplicateResponse(duplicate_groups=[], recoverable_space=0)

    # Encode with sentence transformer
    model = get_model()
    embeddings = model.encode(contents, batch_size=32, show_progress_bar=False)

    # Compute cosine similarity matrix
    sim_matrix = cosine_similarity(embeddings)

    # Greedy clustering
    visited = set()
    groups: List[List[int]] = []

    for i in range(len(valid_paths)):
        if i in visited:
            continue
        group = [i]
        visited.add(i)
        for j in range(i + 1, len(valid_paths)):
            if j in visited:
                continue
            if sim_matrix[i][j] >= threshold:
                group.append(j)
                visited.add(j)
        if len(group) > 1:
            groups.append(group)

    # Build response
    duplicate_groups: List[TextDuplicateGroup] = []
    total_recoverable = 0

    for group_indices in groups:
        file_infos = []
        for idx in group_indices:
            try:
                file_infos.append(get_file_info(valid_paths[idx]))
            except OSError:
                continue

        if len(file_infos) < 2:
            continue

        representative = max(file_infos, key=lambda f: f.size)
        recoverable = sum(fi.size for fi in file_infos) - representative.size
        total_recoverable += recoverable

        # Average pairwise similarity
        pair_sims = []
        for a in range(len(group_indices)):
            for b in range(a + 1, len(group_indices)):
                pair_sims.append(sim_matrix[group_indices[a]][group_indices[b]])
        avg_sim = float(np.mean(pair_sims)) if pair_sims else 1.0

        duplicate_groups.append(TextDuplicateGroup(
            representative=representative,
            files=file_infos,
            similarity_score=round(avg_sim, 3),
            recoverable_space=recoverable,
        ))

    return TextDuplicateResponse(
        duplicate_groups=duplicate_groups,
        recoverable_space=total_recoverable,
    )
