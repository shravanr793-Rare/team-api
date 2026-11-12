
from fastapi import APIRouter

router = APIRouter()


@router.get("/add")
def add_numbers(a: float, b: float):
    return {"result": a + b}
