"""
AI Smart Duplicate File Finder - Backend
FastAPI application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import scan, duplicates, analytics, recommendation

app = FastAPI(
    title="AI Smart Duplicate File Finder",
    description="An AI-powered Storage Intelligence System for finding and managing duplicate files.",
    version="1.0.0",
)

# Allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(scan.router)
app.include_router(duplicates.router)
app.include_router(analytics.router)
app.include_router(recommendation.router)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "AI Duplicate File Finder"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
