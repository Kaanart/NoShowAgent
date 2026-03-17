import json
import os
from datetime import datetime, timedelta

from backend.backup_agent import BackupPatientAgent


def _to_minutes(time_str: str) -> int:
    h, m = time_str.split(":")
    return int(h) * 60 + int(m)


def _derive_durations(records):
    by_date = {}
    for record in records:
        by_date.setdefault(record["date"], []).append(record)

    durations = {}
    gaps = []
    for same_day in by_date.values():
        same_day.sort(key=lambda item: _to_minutes(item["time"]))
        for idx, current in enumerate(same_day):
            current_id = str(current["id"])
            if idx < len(same_day) - 1:
                next_start = _to_minutes(same_day[idx + 1]["time"])
                current_start = _to_minutes(current["time"])
                gap = max(15, next_start - current_start)
                gaps.append(gap)
                durations[current_id] = gap

    default_duration = int(round(sum(gaps) / len(gaps))) if gaps else 120
    for record in records:
        durations.setdefault(str(record["id"]), int(record.get("duration", default_duration)))
    return durations


def _load_records():
    path = os.path.join(os.path.dirname(__file__), "..", "patients_3_weeks.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def test_find_backups_returns_exactly_three_for_valid_target():
    agent = BackupPatientAgent()
    backups = agent.find_backups(1)
    assert len(backups) == 3


def test_find_backups_meet_future_low_risk_and_duration_constraints():
    records = _load_records()
    durations = _derive_durations(records)
    by_id = {str(r["id"]): r for r in records}

    target = by_id["P1"]
    target_date = datetime.strptime(target["date"], "%Y-%m-%d").date()
    max_candidate_date = target_date + timedelta(days=14)
    target_duration = durations["P1"]

    agent = BackupPatientAgent()
    backups = agent.find_backups(1)

    assert len(backups) == 3
    for backup in backups:
        source = by_id[f"P{backup['id']}"]
        backup_date = datetime.strptime(source["date"], "%Y-%m-%d").date()
        backup_duration = durations[str(source["id"])]

        assert backup_date > target_date
        assert backup_date <= max_candidate_date
        assert float(source["historical_no_show_rate"]) <= BackupPatientAgent.LOW_NO_SHOW_THRESHOLD
        assert backup_duration <= target_duration


def test_find_backups_are_ordered_by_low_risk_first():
    agent = BackupPatientAgent()
    backups = agent.find_backups(1)
    risks = [float(b["risk_score"]) for b in backups]
    assert risks == sorted(risks)


def test_find_backups_returns_empty_when_no_candidates_in_next_two_weeks():
    agent = BackupPatientAgent()
    # P59 is on the last day in the fixture window; no records exist after it.
    backups = agent.find_backups(59)
    assert backups == []
