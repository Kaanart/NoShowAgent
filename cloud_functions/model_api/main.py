import functions_framework
import pickle
import pandas as pd
import numpy as np
import os
from flask import jsonify

# Try to load the model on cold start
model = None
model_path = os.path.join(os.path.dirname(__file__), 'noshow_model.pkl')
try:
    if os.path.exists(model_path):
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
except Exception as e:
    print(f"Failed to load model: {e}")

@functions_framework.http
def predict_noshow(request):
    """
    HTTP Cloud Function to predict no-show probability.
    """
    global model
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    request_json = request.get_json(silent=True)
    
    if not request_json or 'appointment_data' not in request_json:
        return jsonify({"error": "Invalid request, missing appointment_data"}), 400

    appointment_data = request_json['appointment_data']
    
    try:
        df = pd.DataFrame([appointment_data])
        
        # Expected features exactly as trained
        expected_cols = [
            'age', 
            'distance_to_location', 
            'days_since_appointment_created', 
            'days_since_last_appointment', 
            'prev_no_show_count', 
            'no_show_ratio'
        ]
        
        for col in expected_cols:
            if col not in df.columns:
                df[col] = 0.0
                
        # Enforce exact order
        df = df[expected_cols]

        # Get probabilities
        probabilities = model.predict_proba(df)[0]
        noshow_prob = probabilities[1]
        
        return jsonify({
            "probability": float(noshow_prob),
            "risk_level": "High" if noshow_prob > 0.6 else ("Medium" if noshow_prob > 0.4 else "Low")
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
