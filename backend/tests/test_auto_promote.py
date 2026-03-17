from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_auto_promote_endpoint_success():
    # Simulate fetching backup suggestions for a specific high-risk appointment slot
    appointment_id = 1
    response = client.post(f"/promote/{appointment_id}")
    
    # We expect a 200 OK and a response indicating a list of suggested patients
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["status"] == "success"
    assert "suggestions" in data
    assert isinstance(data["suggestions"], list)
    assert len(data["suggestions"]) == 3
    assert "id" in data["suggestions"][0]
    assert "match_score" in data["suggestions"][0]
    assert "risk_score" in data["suggestions"][0]
    assert "historical_no_show_rate" in data["suggestions"][0]
    assert "duration" in data["suggestions"][0]
    assert "available_date" in data["suggestions"][0]
    assert "available_time" in data["suggestions"][0]
    assert data["original_appointment_id"] == appointment_id

def test_auto_promote_endpoint_invalid_appointment():
    # Test for a non-existent appointment
    appointment_id = 999
    response = client.post(f"/promote/{appointment_id}")
    
    # Depending on implementation, might return 404 or 400
    assert response.status_code in [400, 404]
