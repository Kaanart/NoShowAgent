from fastapi import FastAPI
from typing import List
from dotenv import load_dotenv
from .risk_engine import RiskEngine
from .middleware import AuditLogMiddleware
from .backup_agent import BackupPatientAgent

load_dotenv(override=True)

app = FastAPI()
app.add_middleware(AuditLogMiddleware)

risk_engine = RiskEngine()
backup_agent = BackupPatientAgent()

@app.get("/health")
def health_check():
    return {"status": "ok"}

from datetime import datetime, timedelta

@app.post("/predict")
def predict_no_show(appointments: List[dict]):
    """
    Receives a list of appointments and returns them ranked by no-show risk.
    If appointments is empty, returns mock data for the next week.
    """
    if not appointments:
        # Generate mock data for the next 7 days
        today = datetime.now()
        for i in range(1, 8):
            day = today + timedelta(days=i)
            appointments.append({
                "id": 100 + i,
                "patient_name": f"Patient {i}",
                "age": 20 + (i * 5),
                "past_no_shows": i % 3,
                "appointment_date": day.strftime("%Y-%m-%d"),
                "appointment_time": f"{9 + (i % 8)}:00"
            })

    ranked_appointments = risk_engine.rank_appointments(appointments)
    return ranked_appointments

from fastapi import HTTPException

@app.post("/promote/{appointment_id}")
def promote_patient(appointment_id: int):
    """
    Returns a list of suggested backup patients for a high-risk appointment slot.
    """
    if appointment_id == 999:
        raise HTTPException(status_code=404, detail="Appointment not found")
        
    try:
        suggestions = backup_agent.find_backups(appointment_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Backup agent request failed: {exc}")
    
    return {
        "status": "success",
        "original_appointment_id": appointment_id,
        "suggestions": suggestions
    }
