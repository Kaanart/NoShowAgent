import pytest
from backend.risk_engine import RiskEngine

def test_risk_score_calculation():
    engine = RiskEngine()
    
    # Low risk patient
    low_risk_data = {
        "age": 30,
        "past_no_shows": 0,
        "days_since_last_appointment": 30
    }
    low_score = engine.calculate_score(low_risk_data)
    
    # High risk patient (history of no-shows)
    high_risk_data = {
        "age": 25,
        "past_no_shows": 5,
        "days_since_last_appointment": 180
    }
    high_score = engine.calculate_score(high_risk_data)
    
    assert high_score > low_score
    assert 0 <= low_score <= 1.0
    assert 0 <= high_score <= 1.0

def test_risk_ranking():
    engine = RiskEngine()
    appointments = [
        {"id": 1, "age": 30, "past_no_shows": 0},
        {"id": 2, "age": 25, "past_no_shows": 5},
        {"id": 3, "age": 45, "past_no_shows": 1}
    ]
    ranked = engine.rank_appointments(appointments)
    
    assert ranked[0]["id"] == 2 # Highest no-show history should be first
    assert ranked[-1]["id"] == 1 # Lowest risk last
