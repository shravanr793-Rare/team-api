from fastapi.testclient import TestClient
from app.routers.reverse import router
from fastapi import FastAPI

app = FastAPI()
app.include_router(router)

client = TestClient(app)

def test_reverse_word():
    response = client.get("/reverse/hello")
    assert response.status_code == 200
    assert response.json() == {"result": "olleh"}

def test_reverse_another_word():
    response = client.get("/reverse/python")
    assert response.status_code == 200
    assert response.json() == {"result": "nohtyp"}