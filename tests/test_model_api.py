import pytest
import json
from unittest.mock import MagicMock, patch
import sys
import os

# Add the cloud function directory to the path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'cloud_functions', 'model_api')))

# Mock the model before importing main
with patch('os.path.exists') as mock_exists:
    mock_exists.return_value = False
    import main

@pytest.fixture
def client():
    main.app = MagicMock() # Mocking the app if it was a full flask app, but here we just test the function
    return main.predict_noshow

def test_predict_noshow_no_model():
    # Ensure model is None
    main.model = None
    
    request = MagicMock()
    response = main.predict_noshow(request)
    
    data = json.loads(response[0].data)
    assert response[1] == 500
    assert data['error'] == 'Model not loaded'

def test_predict_noshow_invalid_request():
    # Mock a loaded model
    main.model = MagicMock()
    
    request = MagicMock()
    request.get_json.return_value = {}
    
    response = main.predict_noshow(request)
    
    data = json.loads(response[0].data)
    assert response[1] == 400
    assert data['error'] == 'Invalid request, missing appointment_data'

def test_predict_noshow_success():
    # Mock a loaded model with predict_proba
    mock_model = MagicMock()
    mock_model.predict_proba.return_value = [[0.2, 0.8]]
    mock_model.feature_names_in_ = ['age', 'distance_to_clinic']
    main.model = mock_model
    
    request = MagicMock()
    request.get_json.return_value = {
        'appointment_data': {
            'age': 45,
            'distance_to_clinic': 10.5
        }
    }
    
    response = main.predict_noshow(request)
    
    data = json.loads(response[0].data)
    assert response[1] == 200
    assert data['probability'] == 0.8
    assert data['risk_level'] == 'High'

def test_predict_noshow_error_handling():
    # Mock a loaded model that raises an exception
    mock_model = MagicMock()
    mock_model.predict_proba.side_effect = Exception("Test Error")
    mock_model.feature_names_in_ = ['age']
    main.model = mock_model
    
    request = MagicMock()
    request.get_json.return_value = {
        'appointment_data': {
            'age': 45
        }
    }
    
    response = main.predict_noshow(request)
    
    data = json.loads(response[0].data)
    assert response[1] == 500
    assert data['error'] == 'Test Error'
