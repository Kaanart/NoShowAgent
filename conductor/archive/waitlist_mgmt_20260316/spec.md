# Specification: Waitlist Management & Staff Backup Strategy Workflow

## Objective
Develop the backend logic and frontend UI for schedulers to manage "high-risk" slots and utilize the Waitlist Auto-Promote feature to invite backup patients.

## Context
- **Product:** MRI no-show prediction system.
- **Key Features:** Waitlist Management, Waitlist Auto-Promote.
- **Constraints:** HIPAA Compliance.

## Requirements
1. **Backend (Python/FastAPI):**
   - Implement endpoints for retrieving waitlisted patients.
   - Implement endpoints to trigger the auto-promote workflow for a high-risk slot.
2. **Frontend (React/TypeScript):**
   - Add a waitlist management section to the dashboard.
   - Add actionable buttons to high-risk appointments to trigger the auto-promote workflow.