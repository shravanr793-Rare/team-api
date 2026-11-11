
from pathlib import Path

from fastapi import FastAPI

app = FastAPI(
    title="Team API",
    description="A collaborative API project demonstrating CI/CD with Docker, GitHub Actions and Railway.",
    version="1.0.0"
)

VERSION_FILE = Path(__file__).parent / "version.txt"

VERSION = (
    VERSION_FILE.read_text().strip()
    if VERSION_FILE.exists()
    else "dev"
)


@app.get("/health", tags=["Health"])
def health():
    return {
        "status": "ok",
        "version": VERSION
    }
