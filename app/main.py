
from pathlib import Path

from fastapi import FastAPI
from app.routers.greet import router as greet_router
from app.routers.add import router as add_router

from app.routers.reverse import router as reverse_router
from app.routers.wordcount import router as wordcount_router

app = FastAPI(
    title="My API",
    description="A collaborative API project demonstrating CI/CD with Docker, GitHub Actions and Railway.",
    version="1.0.0"
)

app.include_router(greet_router)
app.include_router(add_router)

app.include_router(reverse_router)
app.include_router(wordcount_router)

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





# Modified by Shravan
# Modified by ME