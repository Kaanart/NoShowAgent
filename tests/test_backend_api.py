import pytest
import json
from unittest.mock import MagicMock, patch
import sys
import os
import requests_mock

# Add the cloud function directory to the path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'cloud_functions', 'backend_api')))

# Mock BigQuery before importing main
with patch('google.cloud.bigquery.Client') as mock_bq_client:
    import main

@pytest.fixture
def client():
    # Mocking the request object
    pass

@patch('main.get_appointments_from_bq')
def test_get_dashboard_data_success(mock_get_appointments):
    # Setup mock data for BigQuery return
    mock_get_appointments.return_value = [
        {
            "appointment_id": "A1",
            "patient_id": "P1",
            "appointment_datetime": "2026-03-25 10:00:00",
            "clinic_id": "C1",
            "provider_id": "DR1",
            "appointment_type": "Checkup",
            "status": "Scheduled",
            "age": 50,
            "gender": "M",
            "distance_to_clinic": 10.0,
            "historical_no_show_rate": 0.5
        }
    ]

    with requests_mock.Mocker() as m:
        # Mock the external Model API call
        m.post('http://localhost:8080/predict', json={
            'probability': 0.85,
            'risk_level': 'High'
        })

        # Mock the incoming request
        request = MagicMock()
        request.args.get.return_value = 10

        # Call the function
        response = main.get_dashboard_data(request)

        # Assertions
        assert response[1] == 200
        data = json.loads(response[0].data)
        
        assert data['count'] == 1
        
        appt = data['appointments'][0]
        assert appt['id'] == "A1"
        assert appt['no_show_probability'] == 0.85
        assert appt['risk_level'] == "High"
        assert appt['patient_details']['age'] == 50

@patch('main.get_appointments_from_bq')
def test_get_dashboard_data_model_api_failure(mock_get_appointments):
    # Setup mock data for BigQuery return
    mock_get_appointments.return_value = [
        {
            "appointment_id": "A2",
            "patient_id": "P2",
            "appointment_datetime": "2026-03-25 10:00:00",
            "clinic_id": "C1",
            "provider_id": "DR1",
            "appointment_type": "Checkup",
            "status": "Scheduled",
            "age": 30,
            "gender": "F",
            "distance_to_clinic": 5.0,
            "historical_no_show_rate": 0.1
        }
    ]

    with requests_mock.Mocker() as m:
        # Mock the external Model API call to fail
        m.post('http://localhost:8080/predict', status_code=500)

        # Mock the incoming request
        request = MagicMock()
        request.args.get.return_value = 10

        # Call the function
        response = main.get_dashboard_data(request)

        # Assertions - The backend should handle the model API failure gracefully
        assert response[1] == 200
        data = json.loads(response[0].data)
        
        appt = data['appointments'][0]
        assert appt['no_show_probability'] == 0.0
        assert appt['risk_level'] == "Unknown"
        assert 'error' in data['appointments'][0] == False # We don't necessarily expose the internal error structure in the top level formatting if we default it

def test_get_dashboard_data_bq_fallback():
    # If get_appointments_from_bq throws an exception (e.g., no credentials), 
    # it should fall back to the mock data defined in the function for testing purposes.
    
    with patch('main.get_appointments_from_bq', side_effect=Exception("BQ Error")):
        with requests_mock.Mocker() as m:
            m.post('http://localhost:8080/predict', json={'probability': 0.1, 'risk_level': 'Low'})
            
            request = MagicMock()
            request.args.get.return_value = 10
            
            response = main.get_dashboard_data(request)
            
            assert response[1] == 200
            data = json.loads(response[0].data)
            assert data['count'] == 2 # Mock data has 2 items
