import os
from google.cloud import bigquery

def load_data_to_bigquery():
    # Initialize the BigQuery client
    try:
        client = bigquery.Client()
    except Exception as e:
        print(f"Failed to initialize BigQuery client: {e}")
        return

    project_id = client.project
    dataset_name = "noshow_prediction"
    dataset_id = f"{project_id}.{dataset_name}"
    
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    # Configure the datasets to load
    data_files = [
        {
            "table_id": f"{dataset_id}.patients",
            "file_path": os.path.join(base_dir, "data", "mock_patients.csv"),
            "schema_file": os.path.join(base_dir, "schema", "patient_schema.json")
        },
        {
            "table_id": f"{dataset_id}.appointments",
            "file_path": os.path.join(base_dir, "data", "mock_appointments.csv"),
            "schema_file": os.path.join(base_dir, "schema", "appointment_schema.json")
        }
    ]
    
    for df in data_files:
        if not os.path.exists(df["file_path"]):
            print(f"File not found: {df['file_path']}")
            continue
            
        print(f"Loading {df['file_path']} into {df['table_id']}...")
        
        job_config = bigquery.LoadJobConfig(
            source_format=bigquery.SourceFormat.CSV,
            skip_leading_rows=1,
            autodetect=False,
            write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE
        )
        
        with open(df["file_path"], "rb") as source_file:
            job = client.load_table_from_file(source_file, df["table_id"], job_config=job_config)

        try:
            job.result()  # Waits for the job to complete.
            
            table = client.get_table(df["table_id"])  # Make an API request.
            print(
                f"Loaded {table.num_rows} rows and {len(table.schema)} columns to {df['table_id']}"
            )
        except Exception as e:
            print(f"Failed to load data into {df['table_id']}: {e}")
            for err in job.errors:
                print(err)

if __name__ == "__main__":
    load_data_to_bigquery()
