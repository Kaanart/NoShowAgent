from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_predict_endpoint_includes_date_time():
    appointments = [
        {
            "id": 1, 
            "age": 30, 
            "past_no_shows": 0,
            "appointment_date": "2026-03-23",
            "appointment_time": "10:00"
        }
    ]
    response = client.post("/predict", json=appointments)
    assert response.status_code == 200
    data = response.json()
    assert data[0]["id"] == 1
    assert "appointment_date" in data[0]
    assert "appointment_time" in data[0]
    assert data[0]["appointment_date"] == "2026-03-23"
    assert data[0]["appointment_time"] == "10:00"

def test_predict_endpoint_generates_next_week_if_empty():
    response = client.post("/predict", json=[])
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert "appointment_date" in data[0]
    assert "appointment_time" in data[0]

