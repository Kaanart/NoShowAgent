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
    # Pass exactly the features the model was trained on
    features = {
        'age': appointment_data.get('age', 0),
        'distance_to_location': appointment_data.get('distance_to_location', 0.0),
        'days_since_appointment_created': appointment_data.get('days_since_appointment_created', 0),
        'days_since_last_appointment': appointment_data.get('days_since_last_appointment', 0),
        'prev_no_show_count': appointment_data.get('prev_no_show_count', 0),
        'no_show_ratio': appointment_data.get('no_show_ratio', 0.0)
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
            print(f"BigQuery fetch failed: {bq_err}. Falling back to synthetic prediction data.")
            import random
            import json
            
            # Read synthetic_prediction_data.csv
            # Compute path relative to this file
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            csv_path = os.path.join(base_dir, 'data', 'synthetic_prediction_data.csv')
            
            try:
                pred_df = pd.read_csv(csv_path)
                # Take a random sample of rows (or top rows) to show in the UI week view
                pred_sample = pred_df.sample(n=min(30, len(pred_df)), random_state=42).to_dict('records')
            except Exception as read_err:
                print(f"Failed to read CSV: {read_err}")
                pred_sample = []

            raw_appointments = []
            providers = ["DR01", "DR02", "DR03", "DR04"]
            hours_to_add = [8, 9, 10, 11, 13, 14, 15, 16]
            
            for row in pred_sample:
                # Assign a random time for the dashboard UI
                hour = random.choice(hours_to_add)
                date_str = row['appointment_date'] # "YYYY-MM-DD"
                
                # e.g., "2026-03-17T09:00:00Z"
                dt_iso = f"{date_str}T{hour:02d}:00:00Z"
                
                raw_appointments.append({
                    "appointment_id": f"A{random.randint(1000, 9999)}",
                    "patient_id": row['patient_id'],
                    "appointment_datetime": dt_iso,
                    "clinic_id": "C01",
                    "provider_id": random.choice(providers),
                    "appointment_type": row['appointment_type'],
                    "status": "Scheduled",
                    "age": row['age'],
                    "gender": random.choice(["M", "F"]),
                    "distance_to_location": row['distance_to_location'],
                    "days_since_appointment_created": row['days_since_appointment_created'],
                    "days_since_last_appointment": row['days_since_last_appointment'],
                    "prev_no_show_count": row['prev_no_show_count'],
                    "no_show_ratio": row['no_show_ratio']
                })

        dashboard_data = []

        # 2. Get predictions for each appointment and format
        for appt in raw_appointments:
            # Get prediction
            prediction = call_model_api(appt)
            
            # If the model API is not running, it returns an error and 0.0 probability.
            # We'll intercept that and use the mock historical_no_show_rate instead.
            if prediction.get('probability') == 0.0 and 'error' in prediction:
                prob = appt.get('historical_no_show_rate', 0.5)
                risk = "High" if prob > 0.7 else "Medium" if prob > 0.3 else "Low"
                prediction = {"probability": prob, "risk_level": risk}
            
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
