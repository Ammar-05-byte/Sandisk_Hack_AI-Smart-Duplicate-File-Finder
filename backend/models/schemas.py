from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class ScanRequest(BaseModel):
    directory_path: str


class FileInfo(BaseModel):
    path: str
    name: str
    size: int
    extension: str
    last_modified: float
    mime_type: str


class ScanResponse(BaseModel):
    total_files: int
    total_size: int
    file_summary: List[FileInfo]


class DuplicateGroup(BaseModel):
    hash: str
    files: List[FileInfo]
    recoverable_space: int


class ExactDuplicateResponse(BaseModel):
    duplicate_groups: List[DuplicateGroup]
    recoverable_space: int
    total_duplicate_files: int


class ImageDuplicateGroup(BaseModel):
    representative: FileInfo
    files: List[FileInfo]
    similarity_score: float
    recoverable_space: int
    has_faces: bool


class ImageDuplicateResponse(BaseModel):
    duplicate_groups: List[ImageDuplicateGroup]
    recoverable_space: int


class TextDuplicateGroup(BaseModel):
    representative: FileInfo
    files: List[FileInfo]
    similarity_score: float
    recoverable_space: int


class TextDuplicateResponse(BaseModel):
    duplicate_groups: List[TextDuplicateGroup]
    recoverable_space: int


class RecommendRequest(BaseModel):
    duplicate_group: List[FileInfo]


class RecommendationScores(BaseModel):
    resolution_score: float
    recency_score: float
    folder_priority_score: float
    size_score: float
    total_score: float


class RecommendationResponse(BaseModel):
    recommended_file: FileInfo
    scores: Dict[str, RecommendationScores]
    emotional_importance: bool
    reason: str


class FileTypeDistribution(BaseModel):
    type: str
    count: int
    size: int


class StorageAnalyticsResponse(BaseModel):
    total_storage: int
    duplicate_storage: int
    unique_storage: int
    file_type_distribution: List[FileTypeDistribution]
    co2_saved_kg: float
    gb_recoverable: float


class StoragePredictionResponse(BaseModel):
    days_until_full: Optional[int]
    growth_rate_gb_per_day: float
    predicted_sizes: List[Dict[str, Any]]
    confidence: float


class CleanModeResponse(BaseModel):
    files_to_delete: List[FileInfo]
    space_freed: int
    simulation: bool = True
