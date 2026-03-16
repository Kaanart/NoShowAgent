from typing import List, Dict

class RiskEngine:
    def calculate_score(self, data: Dict) -> float:
        """
        Simple ML-driven heuristic for no-show probability.
        Returns a score between 0.0 and 1.0.
        """
        score = 0.0
        
        # Factor: Past no-shows (Weight: 0.6)
        past_no_shows = data.get("past_no_shows", 0)
        score += min(past_no_shows * 0.15, 0.6)
        
        # Factor: Time since last appointment (Weight: 0.2)
        days = data.get("days_since_last_appointment", 30)
        if days > 90:
            score += 0.2
            
        # Factor: Age heuristic (Weight: 0.2)
        age = data.get("age", 40)
        if age < 30 or age > 80:
            score += 0.2
            
        return min(score, 1.0)

    def rank_appointments(self, appointments: List[Dict]) -> List[Dict]:
        """
        Ranks appointments based on their calculated risk score in descending order.
        """
        for appt in appointments:
            appt["risk_score"] = self.calculate_score(appt)
            
        return sorted(appointments, key=lambda x: x["risk_score"], reverse=True)
