import asyncio
import json
import os
import uuid
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Tuple

from google.adk.agents import Agent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types as genai_types


class BackupPatientAgent:
    """
    Backup finder that uses Google ADK agentic tool-calling.
    """

    LOW_NO_SHOW_THRESHOLD = 0.20
    FALLBACK_DURATION_MINUTES = 120

    def __init__(self, data_file: Optional[str] = None):
        self.data_file = data_file or os.path.join(
            os.path.dirname(__file__), "patients_3_weeks.json"
        )

        self.agent = Agent(
            name="backup_patient_agent",
            model=os.environ.get("ADK_MODEL", "gemini-2.5-flash"),
            description=(
                "Find replacement backup patients from future appointments."
            ),
            instruction=(
                "You are a scheduling backup coordinator. "
                "Always call the tool `select_backup_candidates` to fetch candidates. "
                "Return strictly JSON in this shape: "
                '{"suggestions":[{"id":0,"source_id":"P0","name":"","distance":0.0,'
                '"historical_no_show_rate":0.0,"risk_score":0.0,"duration":0,'
                '"available_date":"YYYY-MM-DD","available_time":"HH:MM","match_score":0.0}]}. '
                "Do not add prose."
            ),
            tools=[self.select_backup_candidates],
        )

    def _load_appointments(self) -> List[Dict[str, Any]]:
        with open(self.data_file, "r", encoding="utf-8") as f:
            return json.load(f)

    def _to_minutes(self, time_str: str) -> int:
        hours, minutes = time_str.split(":")
        return int(hours) * 60 + int(minutes)

    def _derive_duration_by_id(self, appointments: List[Dict[str, Any]]) -> Dict[str, int]:
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
            durations.setdefault(appt_id, appt.get("duration", default_duration))

        return durations

    def _find_target(
        self, appointments: List[Dict[str, Any]], appointment_id: int
    ) -> Optional[Dict[str, Any]]:
        string_id = str(appointment_id)
        prefixed_id = f"P{appointment_id}"
        for appt in appointments:
            appt_id = str(appt.get("id", ""))
            if appt_id == string_id or appt_id == prefixed_id:
                return appt
        return None

    def _score_candidate(
        self,
        candidate: Dict[str, Any],
        target_duration: int,
        candidate_duration: int,
    ) -> float:
        risk = float(candidate.get("historical_no_show_rate", 1.0))
        distance = float(candidate.get("distance", 50.0))
        fit_ratio = candidate_duration / max(target_duration, 1)
        score = (100.0 - (risk * 100.0)) - (distance * 1.5) - (fit_ratio * 5.0)
        return round(max(0.0, min(100.0, score)), 1)

    def select_backup_candidates(
        self, appointment_id: int, limit: int = 3
    ) -> List[Dict[str, Any]]:
        appointments = self._load_appointments()
        durations_by_id = self._derive_duration_by_id(appointments)
        target = self._find_target(appointments, int(appointment_id))

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

        suggestions: List[Dict[str, Any]] = []
        for candidate, candidate_duration in filtered[:limit]:
            source_id = str(candidate["id"])
            numeric_id = int(source_id.replace("P", ""))
            suggestions.append(
                {
                    "id": numeric_id,
                    "source_id": source_id,
                    "name": candidate["name"],
                    "distance": round(float(candidate.get("distance", 0.0)), 1),
                    "historical_no_show_rate": float(
                        candidate.get("historical_no_show_rate", 1.0)
                    ),
                    "risk_score": float(candidate.get("historical_no_show_rate", 1.0)),
                    "duration": candidate_duration,
                    "available_date": candidate["date"],
                    "available_time": candidate["time"],
                    "match_score": self._score_candidate(
                        candidate, target_duration, candidate_duration
                    ),
                }
            )

        return suggestions

    def _normalize_suggestions(self, raw: Any, limit: int) -> List[Dict[str, Any]]:
        if isinstance(raw, dict) and "suggestions" in raw:
            raw = raw["suggestions"]
        if not isinstance(raw, list):
            return []
        normalized: List[Dict[str, Any]] = []
        for item in raw:
            if not isinstance(item, dict):
                continue
            if "id" not in item or "name" not in item:
                continue
            normalized.append(item)
        return normalized[:limit]

    async def _run_adk(self, appointment_id: int, limit: int) -> List[Dict[str, Any]]:
        app_name = "mri_backup_scheduler"
        user_id = "scheduler"
        session_id = str(uuid.uuid4())
        session_service = InMemorySessionService()
        await session_service.create_session(
            app_name=app_name, user_id=user_id, session_id=session_id
        )
        runner = Runner(
            app_name=app_name,
            agent=self.agent,
            session_service=session_service,
        )

        prompt = (
            f"Find exactly {limit} backup patients for appointment_id={appointment_id}. "
            "Use only tool results. Return JSON only."
        )
        message = genai_types.Content(
            role="user",
            parts=[genai_types.Part(text=prompt)],
        )

        final_text = ""
        async for event in runner.run_async(
            user_id=user_id,
            session_id=session_id,
            new_message=message,
        ):
            if hasattr(event, "is_final_response") and event.is_final_response():
                if hasattr(event, "content") and event.content and event.content.parts:
                    final_text = "".join(
                        part.text for part in event.content.parts if getattr(part, "text", None)
                    )

        if not final_text:
            return []

        try:
            payload = json.loads(final_text)
        except Exception:
            return []
        return self._normalize_suggestions(payload, limit)

    def find_backups(self, appointment_id: int, limit: int = 3) -> List[Dict[str, Any]]:
        """
        Uses Google ADK agentic tool-calling only:
        Agent -> tool call -> structured suggestions.
        """
        # Prefer GEMINI_API_KEY when present; Google GenAI SDK otherwise defaults
        # to GOOGLE_API_KEY if both are set.
        api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
        if not api_key:
            raise RuntimeError(
                "Google ADK is not configured. Set GEMINI_API_KEY or GOOGLE_API_KEY for backup suggestions."
            )
        os.environ["GOOGLE_API_KEY"] = api_key
        try:
            return asyncio.run(self._run_adk(int(appointment_id), int(limit)))
        except ValueError:
            raise
