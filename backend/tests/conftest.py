import pytest
import os

from backend.backup_agent import BackupPatientAgent


@pytest.fixture(autouse=True)
def stub_adk_runtime(monkeypatch):
    """
    Test-only stub: keep production code ADK-only while avoiding external
    model/network calls during unit tests.
    """

    monkeypatch.setenv("GOOGLE_API_KEY", "test-api-key")

    async def _fake_run_adk(self, appointment_id: int, limit: int):
        return self.select_backup_candidates(appointment_id, limit)

    monkeypatch.setattr(BackupPatientAgent, "_run_adk", _fake_run_adk)
