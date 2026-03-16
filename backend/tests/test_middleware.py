from fastapi import FastAPI, Request
from fastapi.testclient import TestClient
from backend.middleware import AuditLogMiddleware
import logging
from unittest.mock import patch

app = FastAPI()
app.add_middleware(AuditLogMiddleware)

@app.get("/phi-data")
async def get_phi(request: Request):
    return {"data": "sensitive phi"}

client = TestClient(app)

@patch('backend.middleware.logger')
def test_audit_log_middleware_logs_request(mock_logger):
    response = client.get("/phi-data")
    assert response.status_code == 200
    # Check if logger was called with HIPAA audit message
    mock_logger.info.assert_any_call(
        "HIPAA AUDIT: User anonymous accessed /phi-data"
    )
