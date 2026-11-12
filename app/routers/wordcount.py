from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class WordCountRequest(BaseModel):
    text: str

@router.post("/wordcount")
def count_words(request: WordCountRequest):
    words = request.text.split()
    return {"words": len(words)}