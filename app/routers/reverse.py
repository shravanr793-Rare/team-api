from fastapi import APIRouter

router = APIRouter()

@router.get("/reverse/{text}")
def reverse_text(text: str):
    return {"result": text[::-1]}