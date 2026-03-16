from fastapi.testclient import TestClient
from backend.main import app
from unittest.mock import patch

client = TestClient(app)

@patch('backend.main.risk_engine')
def test_get_waitlist(mock_risk_engine):
    # Mock some waitlist data that the db/service would return
    mock_waitlist_data = [
        {"id": 101, "patient_name": "John Doe", "urgency": "high"},
        {"id": 102, "patient_name": "Jane Smith", "urgency": "medium"}
    ]
    # We will assume a service or db call gets this data, but for the endpoint
    # we just expect it to return a list.
    
    # We will need to mock whatever data access method we create, 
    # but for now, let's just test the endpoint existence and response format.
    # We'll refine the mock when we build the actual service.
    pass 

def test_get_waitlist_endpoint_exists():
    response = client.get("/waitlist")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
