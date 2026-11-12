from fastapi.testclient import TestClient
from app.routers.wordcount import router
from fastapi import FastAPI

app = FastAPI()
app.include_router(router)

client = TestClient(app)

def test_wordcount_sentence():
    response = client.post(
        "/wordcount",
        json={"text": "Hello world from Python"}
    )
    assert response.status_code == 200
    assert response.json() == {"words": 4}

def test_wordcount_empty_text():
    response = client.post(
        "/wordcount",
        json={"text": ""}
    )
    assert response.status_code == 200
    assert response.json() == {"words": 0}