from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_predict_endpoint():
    appointments = [
        {"id": 1, "age": 30, "past_no_shows": 0},
        {"id": 2, "age": 25, "past_no_shows": 5}
    ]
    response = client.post("/predict", json=appointments)
    assert response.status_code == 200
    data = response.json()
    assert data[0]["id"] == 2 # Higher risk first
    assert "risk_score" in data[0]
