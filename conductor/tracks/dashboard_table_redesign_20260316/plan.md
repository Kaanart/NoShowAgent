# Implementation Plan

## Phase 1: Structural Redesign
- [ ] Task: Update the Dashboard table columns
    - [ ] Write Tests for new column headers and data structure mapping
    - [ ] Implement Feature: Refactor the table inside `Dashboard.tsx` to include `RISK`, `PATIENT NAME`, `SCAN TYPE`, `DATE & TIME`, and `PREDICTION SCORE`
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Structural Redesign' (Protocol in workflow.md)

## Phase 2: Visual Elements & Formatting
- [ ] Task: Implement custom styling for new columns
    - [ ] Write Tests for rendering risk indicators and relative date strings
    - [ ] Implement Feature: Create helper functions for 'Today/Tomorrow/Oct 24' and '09:00 AM - 10:00 AM' timeframes. Implement the visual Prediction Score progress bar and Risk dot icons
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Visual Elements & Formatting' (Protocol in workflow.md)

## Phase 3: Pagination Footer
- [ ] Task: Build the visual pagination mock
    - [ ] Write Tests to ensure the footer renders
    - [ ] Implement Feature: Add the 'Showing 1 to 5...' footer with styling to match the provided layout
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Pagination Footer' (Protocol in workflow.md)