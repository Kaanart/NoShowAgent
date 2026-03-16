from google.cloud import bigquery
import os

class BigQueryClient:
    def __init__(self, project_id: str = None):
        self.project_id = project_id or os.getenv("GOOGLE_CLOUD_PROJECT")
        self.client = bigquery.Client(project=self.project_id)

    def get_data(self, query: str):
        query_job = self.client.query(query)
        return query_job.result()
