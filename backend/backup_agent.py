import os
from google.cloud import bigquery

class BackupPatientAgent:
    """
    An ADK Agent responsible for identifying suitable backup patients 
    for appointments with a high risk of a no-show.
    """
    def __init__(self, bq_client=None):
        self.bq_client = bq_client
        self.project_id = os.environ.get('GOOGLE_CLOUD_PROJECT', 'noshow-agent-project')
        self.dataset_id = f"{self.project_id}.noshow_prediction"

    def find_backups(self, appointment_id, limit=3):
        """
        Executes the agent's logic to query, filter, score, and rank potential backup patients.
        """
        try:
            if not self.bq_client:
                raise Exception("BigQuery client not initialized")
            
            # Agent Reasoning Logic:
            # 1. Look for patients with a low historical no-show rate (< 30%).
            # 2. Prioritize patients who live close to the clinic.
            # 3. Calculate a "match_score" based on these factors.
            
            query = f"""
                SELECT 
                    patient_id as id,
                    CONCAT('Patient ', patient_id) as name,
                    distance_to_clinic as distance,
                    historical_no_show_rate
                FROM `{self.dataset_id}.patients`
                WHERE historical_no_show_rate < 0.3
                ORDER BY distance_to_clinic ASC, historical_no_show_rate ASC
                LIMIT @limit
            """
            job_config = bigquery.QueryJobConfig(
                query_parameters=[
                    bigquery.ScalarQueryParameter("limit", "INT64", limit),
                ]
            )
            results = self.bq_client.query(query, job_config=job_config).result()
            
            suggestions = []
            for row in results:
                # Calculate a conceptual "match score" out of 100
                score = 100 - (row['distance'] * 2) - (row['historical_no_show_rate'] * 100)
                suggestions.append({
                    "id": row['id'],
                    "name": row['name'],
                    "distance": round(row['distance'], 1),
                    "match_score": round(max(0, min(100, score)), 1)
                })
            return suggestions

        except Exception as e:
            print(f"Agent BQ Query failed: {e}. Falling back to mock reasoning data.")
            # Fallback mock data when BQ is not accessible (e.g., local testing)
            return [
                {"id": "P999", "name": "Alice Johnson", "distance": 1.2, "match_score": 98.5},
                {"id": "P888", "name": "Bob Smith", "distance": 3.4, "match_score": 85.0},
                {"id": "P777", "name": "Charlie Davis", "distance": 5.1, "match_score": 75.5}
            ]
