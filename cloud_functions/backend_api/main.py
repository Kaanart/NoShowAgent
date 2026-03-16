import functions_framework
import os
from google.cloud import bigquery
import requests
import pandas as pd
from flask import jsonify
import datetime
from backup_agent import BackupPatientAgent

# Setup BigQuery Client
# Ensure GOOGLE_APPLICATION_CREDENTIALS is set in the environment or function is deployed with correct service account
try:
    bq_client = bigquery.Client()
except Exception as e:
    print(f"Failed to initialize BigQuery client: {e}")
    bq_client = None

# Get Model API URL from environment variables
# For local testing, this might be localhost or a mock URL
MODEL_API_URL = os.environ.get('MODEL_API_URL', 'http://localhost:8080/predict')
PROJECT_ID = os.environ.get('GOOGLE_CLOUD_PROJECT', 'noshow-agent-project') # Fallback project ID
DATASET_ID = f"{PROJECT_ID}.noshow_prediction"

def get_appointments_from_bq(limit=10):
    """Fetches upcoming appointments from BigQuery with joined patient data."""
    if not bq_client:
        raise Exception("BigQuery client not initialized")

    query = f"""
        SELECT 
            a.appointment_id,
            a.patient_id,
            a.appointment_datetime,
            a.clinic_id,
            a.provider_id,
            a.appointment_type,
            a.status,
            p.age,
            p.gender,
            p.distance_to_clinic,
            p.historical_no_show_rate
        FROM `{DATASET_ID}.appointments` AS a
        JOIN `{DATASET_ID}.patients` AS p ON a.patient_id = p.patient_id
        WHERE a.status = 'Scheduled' 
          AND a.appointment_datetime >= CURRENT_TIMESTAMP()
        ORDER BY a.appointment_datetime ASC
        LIMIT @limit
    """
    
    job_config = bigquery.QueryJobConfig(
        query_parameters=[
            bigquery.ScalarQueryParameter("limit", "INT64", limit),
        ]
    )
    
    query_job = bq_client.query(query, job_config=job_config)
    results = query_job.result()
    
    # Convert to list of dicts
    appointments = []
    for row in results:
        appointments.append(dict(row))
        
    return appointments

def call_model_api(appointment_data):
    """Calls the Model API to get a prediction."""
    # Basic feature engineering transformation to match model expectations
    # This must align with what the model was trained on
    
    # Example transformation matching the mock training data
    dt = appointment_data['appointment_datetime']
    # If dt is a string, parse it, if it's already a datetime object, use it directly
    if isinstance(dt, str):
        try:
             dt = datetime.datetime.fromisoformat(dt.replace('Z', '+00:00'))
        except ValueError:
             dt = datetime.datetime.strptime(dt, "%Y-%m-%d %H:%M:%S")

    features = {
        'age': appointment_data.get('age', 0),
        'distance_to_clinic': appointment_data.get('distance_to_clinic', 0.0),
        'historical_no_show_rate': appointment_data.get('historical_no_show_rate', 0.0),
        'hour': dt.hour if dt else 12 # Default to 12 PM if parsing fails
    }
    
    try:
        response = requests.post(
            MODEL_API_URL, 
            json={"appointment_data": features},
            timeout=5
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error calling model API: {e}")
        return {"probability": 0.0, "risk_level": "Unknown", "error": str(e)}

@functions_framework.http
def get_dashboard_data(request):
    """
    HTTP Cloud Function to route requests for appointments or finding backups.
    """
    # Set CORS headers for the preflight request
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    # Set CORS headers for the main request
    cors_headers = {'Access-Control-Allow-Origin': '*'}

    # Router logic
    if 'find-backup' in request.path:
        try:
            appt_id = request.args.get('appointmentId')
            agent = BackupPatientAgent(bq_client)
            suggestions = agent.find_backups(appt_id)
            return jsonify({"suggestions": suggestions}), 200, cors_headers
        except Exception as e:
            return jsonify({"error": str(e)}), 500, cors_headers

    try:
        # 1. Fetch upcoming appointments
        limit = request.args.get('limit', default=10, type=int)
        
        # We wrap this in a try-catch for local testing where BQ might not be available
        try:
            raw_appointments = get_appointments_from_bq(limit)
        except Exception as bq_err:
            print(f"BigQuery fetch failed: {bq_err}. Falling back to mock data for testing.")
            # Fallback to mock data if BQ fails (useful for local testing before deployment)
            raw_appointments = [
                {
                    "appointment_id": "A101", "patient_id": "P202", "appointment_datetime": "2026-03-25T10:00:00Z",
                    "clinic_id": "C01", "provider_id": "DR01", "appointment_type": "Checkup", "status": "Scheduled",
                    "age": 45, "gender": "M", "distance_to_clinic": 12.5, "historical_no_show_rate": 0.8
                },
                {
                     "appointment_id": "A102", "patient_id": "P203", "appointment_datetime": "2026-03-25T11:00:00Z",
                    "clinic_id": "C01", "provider_id": "DR02", "appointment_type": "Follow-up", "status": "Scheduled",
                    "age": 30, "gender": "F", "distance_to_clinic": 2.5, "historical_no_show_rate": 0.1
                }
            ]

        dashboard_data = []

        # 2. Get predictions for each appointment and format
        for appt in raw_appointments:
            # Get prediction
            prediction = call_model_api(appt)
            
            # Format the output
            # Convert datetime to string if it's an object
            dt_str = appt['appointment_datetime']
            if not isinstance(dt_str, str):
                dt_str = dt_str.isoformat()

            formatted_appt = {
                "id": appt['appointment_id'],
                "patient_id": appt['patient_id'],
                "time": dt_str,
                "provider": appt['provider_id'],
                "type": appt['appointment_type'],
                "no_show_probability": prediction.get('probability', 0.0),
                "risk_level": prediction.get('risk_level', 'Unknown'),
                "patient_details": {
                    "age": appt['age'],
                    "gender": appt['gender']
                }
            }
            dashboard_data.append(formatted_appt)

        # 3. Return formatted JSON
        return jsonify({
            "appointments": dashboard_data,
            "count": len(dashboard_data)
        }), 200, cors_headers

    except Exception as e:
        return jsonify({"error": str(e)}), 500, cors_headers
