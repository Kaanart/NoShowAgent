# Specification: Integrate Backup Agent and Dialog

## Objective
Integrate the provided `backup_agent.py` into the backend and implement a frontend dialog to display suggested backup patients when the "Find a Backup" button is clicked. The dialog should list patients sorted by lowest risk (highest match score) to highest risk. Clicking a patient immediately promotes them.

## Context
- **Product:** MRI no-show prediction system.
- **Source Material:** `backup_agent.py` script.
- **Scope:** `backend/main.py`, new `backend/backup_agent.py`, `frontend/src/components/ui/Dialog.tsx`, and updates to `Dashboard` and `CalendarView`.

## Requirements
1. **Backend Integration (Python/FastAPI):**
   - Copy the `backup_agent.py` logic into the `backend/` directory.
   - Initialize the `BackupPatientAgent` within the FastAPI application.
   - Update the existing `/promote/{appointment_id}` endpoint to use the agent to fetch and return backup patient suggestions instead of simulating a single promotion.
2. **Frontend Dialog Component (React/TypeScript):**
   - Create a reusable, custom `Dialog` (or `Modal`) component matching the project's design system.
   - Update the `Dashboard` and `CalendarView` components to open the dialog when the "Find a Backup" button is clicked.
   - Display the suggested backup patients inside the dialog, sorting them from less risky to higher risk (e.g., highest match score first).
3. **One-Click Promotion:**
   - Implement one-click promotion logic where clicking a patient in the dialog triggers the final promotion action (and closes the dialog).