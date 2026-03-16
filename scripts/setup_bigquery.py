import os
import json
from google.cloud import bigquery

def setup_bigquery():
    # Initialize the BigQuery client
    # Assumes GOOGLE_APPLICATION_CREDENTIALS environment variable is set
    try:
        client = bigquery.Client()
    except Exception as e:
        print(f"Failed to initialize BigQuery client: {e}")
        print("Please ensure GOOGLE_APPLICATION_CREDENTIALS is set.")
        return

    project_id = client.project
    dataset_name = "noshow_prediction"
    dataset_id = f"{project_id}.{dataset_name}"
    
    # Create dataset
    dataset = bigquery.Dataset(dataset_id)
    dataset.location = "US"
    try:
        dataset = client.create_dataset(dataset, exists_ok=True)
        print(f"Dataset {dataset.dataset_id} created or already exists.")
    except Exception as e:
        print(f"Failed to create dataset: {e}")
        return
    
    # Define tables
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    tables = [
        {"name": "patients", "schema_file": os.path.join(base_dir, "schema", "patient_schema.json")},
        {"name": "appointments", "schema_file": os.path.join(base_dir, "schema", "appointment_schema.json")}
    ]
    
    for table_info in tables:
        table_ref = f"{dataset_id}.{table_info['name']}"
        schema_path = table_info['schema_file']
        
        try:
            with open(schema_path, 'r') as f:
                schema_json = json.load(f)
            
            schema = [bigquery.SchemaField.from_api_repr(field) for field in schema_json]
            
            table = bigquery.Table(table_ref, schema=schema)
            table = client.create_table(table, exists_ok=True)
            print(f"Table {table.table_id} created or already exists.")
        except Exception as e:
            print(f"Failed to create table {table_info['name']}: {e}")

if __name__ == "__main__":
    setup_bigquery()
