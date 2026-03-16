# Specification: Calendar View Dashboard Update

## Objective
Update the Risk Dashboard to display appointments for the next week in a calendar-like view, including specific times and dates, replacing the current simple table format.

## Context
- **Product:** MRI no-show prediction system.
- **Key Features:** Risk Dashboard, Weekly Calendar View.
- **Constraints:** Responsive layout for desktop (schedulers).

## Requirements
1. **Backend (Python/FastAPI):**
   - Update appointment data models and the `/predict` endpoint to return date and time for appointments spanning the next 7 days.
2. **Frontend (React/TypeScript):**
   - Replace the table view in the `Dashboard` component with a calendar grid (e.g., days of the week as columns, hours as rows).
   - Display appointment blocks within the calendar, indicating time, patient ID/age, and the risk score.
   - Retain the "Auto-Promote" functionality for high-risk appointments within the calendar view.