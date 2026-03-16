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
