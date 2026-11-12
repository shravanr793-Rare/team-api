
from fastapi.testclient import TestClient
from app.routers.add import router
from fastapi import FastAPI

app = FastAPI()
app.include_router(router)

client = TestClient(app)


def test_add_positive_numbers():
    response = client.get("/add?a=2&b=3")

    assert response.status_code == 200
    assert response.json() == {"result": 5}


def test_add_decimal_numbers():
    response = client.get("/add?a=5.5&b=2.5")

    assert response.status_code == 200
    assert response.json() == {"result": 8.0}


def test_add_negative_numbers():
    response = client.get("/add?a=-5&b=3")

    assert response.status_code == 200
    assert response.json() == {"result": -2}
