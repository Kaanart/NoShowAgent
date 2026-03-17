import json
import os
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Tuple

try:
    # Google ADK import path.
    from google.adk.agents import Agent  # type: ignore
except Exception:
    class Agent:  # type: ignore[override]
        """
        Minimal fallback when Google ADK is not installed in local dev/test env.
        """
        def __init__(self, name: str, description: str, tools: Optional[List[Any]] = None):
            self.name = name
            self.description = description
            self.tools = tools or []


class BackupPatientAgent:
    """
    An ADK-style agent responsible for identifying suitable backup patients
    for appointments with a high risk of a no-show.
    """
    LOW_NO_SHOW_THRESHOLD = 0.20
    FALLBACK_DURATION_MINUTES = 120

    def __init__(self, data_file: Optional[str] = None):
        self.data_file = data_file or os.path.join(
            os.path.dirname(__file__), "patients_3_weeks.json"
        )
        self.agent = Agent(
            name="backup_patient_agent",
            description=(
                "Find backup patients from future appointments using low no-show risk "
                "and duration-fit constraints."
            ),
            tools=[
                self._load_appointments_tool,
                self._derive_duration_by_id_tool,
                self._find_target_tool,
                self._score_candidate_tool,
            ],
        )

    def _load_appointments_tool(self) -> List[Dict[str, Any]]:
        with open(self.data_file, "r", encoding="utf-8") as f:
            return json.load(f)

    def _to_minutes(self, time_str: str) -> int:
        hours, minutes = time_str.split(":")
        return int(hours) * 60 + int(minutes)

    def _derive_duration_by_id_tool(
        self, appointments: List[Dict[str, Any]]
    ) -> Dict[str, int]:
        # ADK tool step: infer duration from explicit field or day-slot gaps.
        durations: Dict[str, int] = {}
        slot_gaps: List[int] = []
        by_date: Dict[str, List[Dict[str, Any]]] = {}

        for appt in appointments:
            by_date.setdefault(appt["date"], []).append(appt)

        for same_day in by_date.values():
            same_day.sort(key=lambda a: self._to_minutes(a["time"]))
            for index, current in enumerate(same_day):
                explicit = current.get("duration")
                if isinstance(explicit, int) and explicit > 0:
                    durations[str(current["id"])] = explicit
                    continue

                if index < len(same_day) - 1:
                    next_start = self._to_minutes(same_day[index + 1]["time"])
                    current_start = self._to_minutes(current["time"])
                    inferred = max(15, next_start - current_start)
                    slot_gaps.append(inferred)
                    durations[str(current["id"])] = inferred

        default_duration = (
            int(round(sum(slot_gaps) / len(slot_gaps)))
            if slot_gaps
            else self.FALLBACK_DURATION_MINUTES
        )

        for appt in appointments:
            appt_id = str(appt["id"])
            durations.setdefault(
                appt_id,
                appt.get("duration", default_duration),
            )

        return durations

    def _find_target_tool(
        self, appointments: List[Dict[str, Any]], appointment_id: int
    ) -> Optional[Dict[str, Any]]:
        string_id = str(appointment_id)
        prefixed_id = f"P{appointment_id}"
        for appt in appointments:
            appt_id = str(appt.get("id", ""))
            if appt_id == string_id or appt_id == prefixed_id:
                return appt
        return None

    def _score_candidate_tool(
        self,
        candidate: Dict[str, Any],
        target_duration: int,
        candidate_duration: int,
    ) -> float:
        # ADK scoring: lowest no-show risk first, then distance, then duration fit.
        risk = float(candidate.get("historical_no_show_rate", 1.0))
        distance = float(candidate.get("distance", 50.0))
        fit_ratio = candidate_duration / max(target_duration, 1)
        score = (100.0 - (risk * 100.0)) - (distance * 1.5) - (fit_ratio * 5.0)
        return round(max(0.0, min(100.0, score)), 1)

    def find_backups(self, appointment_id, limit=3):
        """
        ADK pipeline:
        1) Load appointment data from patients_3_weeks.json
        2) Find the target appointment
        3) Search only future appointments
        4) Filter low no-show probability and duration-fit candidates
        5) Rank and return top-N backups
        """
        try:
            appointments = self._load_appointments_tool()
            durations_by_id = self._derive_duration_by_id_tool(appointments)
            target = self._find_target_tool(appointments, int(appointment_id))

            if not target:
                raise ValueError(f"Appointment {appointment_id} not found")

            target_date = datetime.strptime(target["date"], "%Y-%m-%d").date()
            max_candidate_date = target_date + timedelta(days=14)
            target_duration = durations_by_id[str(target["id"])]
            target_id = str(target["id"])

            filtered: List[Tuple[Dict[str, Any], int]] = []
            for candidate in appointments:
                candidate_id = str(candidate["id"])
                if candidate_id == target_id:
                    continue

                candidate_date = datetime.strptime(candidate["date"], "%Y-%m-%d").date()
                if candidate_date <= target_date:
                    continue
                if candidate_date > max_candidate_date:
                    continue

                candidate_no_show = float(candidate.get("historical_no_show_rate", 1.0))
                if candidate_no_show > self.LOW_NO_SHOW_THRESHOLD:
                    continue

                candidate_duration = durations_by_id[candidate_id]
                if candidate_duration > target_duration:
                    continue

                filtered.append((candidate, candidate_duration))

            filtered.sort(
                key=lambda item: (
                    float(item[0].get("historical_no_show_rate", 1.0)),
                    float(item[0].get("distance", 999.0)),
                    item[0].get("date", ""),
                    item[0].get("time", ""),
                )
            )

            suggestions = []
            for candidate, candidate_duration in filtered[:limit]:
                numeric_id = int(str(candidate["id"]).replace("P", ""))
                suggestions.append(
                    {
                        "id": numeric_id,
                        "source_id": candidate["id"],
                        "name": candidate["name"],
                        "distance": round(float(candidate.get("distance", 0.0)), 1),
                        "historical_no_show_rate": float(
                            candidate.get("historical_no_show_rate", 1.0)
                        ),
                        "risk_score": float(
                            candidate.get("historical_no_show_rate", 1.0)
                        ),
                        "duration": candidate_duration,
                        "available_date": candidate["date"],
                        "available_time": candidate["time"],
                        "match_score": self._score_candidate_tool(
                            candidate, target_duration, candidate_duration
                        ),
                    }
                )

            return suggestions
        except ValueError:
            raise
        except Exception as e:
            print(f"Backup agent failed: {e}")
            return []
