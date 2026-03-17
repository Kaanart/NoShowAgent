# Implementation Plan

## Phase 1: Backend Agent Integration [checkpoint: e5bf2c5]
- [x] Task: Integrate `BackupPatientAgent` into FastAPI
    - [x] Write Tests to verify the agent returns sorted backup suggestions (42aff5e)
    - [x] Implement Feature: Copy `backup_agent.py` to backend, initialize it in `main.py`, and update `/promote` endpoint to return suggestions (42aff5e)
- [x] Task: Conductor - User Manual Verification 'Phase 1: Backend Agent Integration' (Protocol in workflow.md)

## Phase 2: Frontend Dialog Component
- [x] Task: Build reusable Dialog component
    - [x] Write Tests for custom Dialog UI component rendering and interactions (652ae1d)
    - [x] Implement Feature: Create a styled `Dialog.tsx` component in `frontend/src/components/ui/` matching the design system (652ae1d)
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Frontend Dialog Component' (Protocol in workflow.md)

## Phase 3: Connect UI to Backend Logic
- [ ] Task: Implement backup selection dialog
    - [~] Write Tests to verify the dialog displays sorted suggestions and handles promotion clicks
    - [ ] Implement Feature: Update `Dashboard` and `CalendarView` to fetch suggestions from `/promote`, open the dialog, and handle one-click promotion logic
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Connect UI to Backend Logic' (Protocol in workflow.md)