import unittest
from unittest.mock import MagicMock, patch
from cloud_functions.backend_api.backup_agent import BackupPatientAgent

class TestBackupPatientAgent(unittest.TestCase):
    
    def test_find_backups_with_mock_data(self):
        # Initialize without a BigQuery client to trigger the fallback logic
        agent = BackupPatientAgent(bq_client=None)
        
        # Call the find_backups method
        suggestions = agent.find_backups("A101")
        
        # Verify the fallback mock data is returned correctly
        self.assertEqual(len(suggestions), 3)
        self.assertEqual(suggestions[0]["id"], "P999")
        self.assertEqual(suggestions[0]["name"], "Alice Johnson")
        self.assertEqual(suggestions[0]["distance"], 1.2)
        self.assertEqual(suggestions[0]["match_score"], 98.5)

    @patch('cloud_functions.backend_api.backup_agent.bigquery')
    def test_find_backups_with_bq_client(self, mock_bq):
        # Mock the BigQuery client and its response
        mock_client = MagicMock()
        mock_query_job = MagicMock()
        
        # Mock result rows
        mock_row_1 = {'id': 'P001', 'name': 'Patient P001', 'distance': 2.0, 'historical_no_show_rate': 0.1}
        mock_row_2 = {'id': 'P002', 'name': 'Patient P002', 'distance': 5.0, 'historical_no_show_rate': 0.05}
        mock_query_job.result.return_value = [mock_row_1, mock_row_2]
        
        mock_client.query.return_value = mock_query_job
        
        agent = BackupPatientAgent(bq_client=mock_client)
        suggestions = agent.find_backups("A102", limit=2)
        
        # Verify BQ was called
        mock_client.query.assert_called_once()
        
        # Verify suggestions are scored and sorted correctly
        self.assertEqual(len(suggestions), 2)
        
        # Score calculation: 100 - (distance * 2) - (no_show * 100)
        # P001: 100 - (2.0 * 2) - (0.1 * 100) = 100 - 4 - 10 = 86.0
        self.assertEqual(suggestions[0]["id"], "P001")
        self.assertEqual(suggestions[0]["match_score"], 86.0)

        # P002: 100 - (5.0 * 2) - (0.05 * 100) = 100 - 10 - 5 = 85.0
        self.assertEqual(suggestions[1]["id"], "P002")
        self.assertEqual(suggestions[1]["match_score"], 85.0)

if __name__ == '__main__':
    unittest.main()
