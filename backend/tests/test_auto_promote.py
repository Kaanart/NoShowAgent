from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_auto_promote_endpoint_success():
    # Simulate promoting a waitlist patient for a specific high-risk appointment slot
    appointment_id = 1
    response = client.post(f"/promote/{appointment_id}")
    
    # We expect a 200 OK and a response indicating which patient was promoted
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "promoted_patient_id" in data
    assert data["original_appointment_id"] == appointment_id

def test_auto_promote_endpoint_invalid_appointment():
    # Test for a non-existent appointment
    appointment_id = 999
    response = client.post(f"/promote/{appointment_id}")
    
    # Depending on implementation, might return 404 or 400
    assert response.status_code in [400, 404]
