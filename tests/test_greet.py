
from fastapi.testclient import TestClient
from app.routers.greet import router
from fastapi import FastAPI

app = FastAPI()
app.include_router(router)

client = TestClient(app)


def test_greet_name():
    response = client.get("/greet/Shravan")

    assert response.status_code == 200
    assert response.json() == {
        "message": "Hello, Shravan!"
    }


def test_greet_another_name():
    response = client.get("/greet/Vasupradaa")

    assert response.status_code == 200
    assert response.json() == {
        "message": "Hello, Vasupradaa!"
    }
