import pytest
from unittest.mock import MagicMock, patch
from backend.bigquery_client import BigQueryClient

@patch('backend.bigquery_client.bigquery.Client')
def test_bigquery_client_initialization(mock_client):
    client = BigQueryClient(project_id="test-project")
    assert client.project_id == "test-project"
    mock_client.assert_called_once()

@patch('backend.bigquery_client.bigquery.Client')
def test_get_data_calls_query(mock_client_class):
    mock_client = mock_client_class.return_value
    client = BigQueryClient(project_id="test-project")
    
    mock_query_job = MagicMock()
    mock_client.query.return_value = mock_query_job
    
    client.get_data("SELECT * FROM test")
    mock_client.query.assert_called_with("SELECT * FROM test")
    mock_query_job.result.assert_called_once()
