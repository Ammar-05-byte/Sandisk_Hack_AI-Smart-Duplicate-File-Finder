import os
import mimetypes
from typing import List
from models.schemas import FileInfo


def get_file_info(file_path: str) -> FileInfo:
    """Extract detailed file info from a path."""
    stat = os.stat(file_path)
    name = os.path.basename(file_path)
    ext = os.path.splitext(name)[1].lower()
    mime_type, _ = mimetypes.guess_type(file_path)
    return FileInfo(
        path=file_path,
        name=name,
        size=stat.st_size,
        extension=ext,
        last_modified=stat.st_mtime,
        mime_type=mime_type or "application/octet-stream",
    )


def format_bytes(size: int) -> str:
    """Human-readable byte size."""
    for unit in ["B", "KB", "MB", "GB", "TB"]:
        if size < 1024:
            return f"{size:.2f} {unit}"
        size /= 1024
    return f"{size:.2f} PB"


def is_image(file_path: str) -> bool:
    mime, _ = mimetypes.guess_type(file_path)
    return mime is not None and mime.startswith("image/")


def is_text_document(file_path: str) -> bool:
    text_extensions = {".txt", ".md", ".rst", ".csv", ".log", ".json", ".xml", ".html", ".htm", ".py", ".js", ".ts", ".css", ".yaml", ".yml", ".toml", ".ini", ".cfg"}
    ext = os.path.splitext(file_path)[1].lower()
    return ext in text_extensions


def bytes_to_gb(size: int) -> float:
    return size / (1024 ** 3)


def co2_from_gb(gb: float) -> float:
    """
    Estimate CO2 savings from storage reduction.
    Average data center emits ~0.06 kg CO2 per GB per year.
    """
    return gb * 0.06
