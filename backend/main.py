from fastapi import FastAPI
from typing import List
from .risk_engine import RiskEngine
from .middleware import AuditLogMiddleware

app = FastAPI()
app.add_middleware(AuditLogMiddleware)

risk_engine = RiskEngine()

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/predict")
def predict_no_show(appointments: List[dict]):
    """
    Receives a list of appointments and returns them ranked by no-show risk.
    """
    ranked_appointments = risk_engine.rank_appointments(appointments)
    return ranked_appointments

@app.get("/waitlist")
def get_waitlist():
    """
    Returns a mock list of patients currently on the waitlist.
    In a real scenario, this would query the database.
    """
    return [
        {"id": 101, "patient_name": "John Doe", "urgency": "high", "requested_days": [1, 2]},
        {"id": 102, "patient_name": "Jane Smith", "urgency": "medium", "requested_days": [2, 3]},
        {"id": 103, "patient_name": "Alice Johnson", "urgency": "low", "requested_days": [1, 4, 5]}
    ]
