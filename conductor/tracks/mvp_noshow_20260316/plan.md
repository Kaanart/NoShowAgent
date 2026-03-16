# Implementation Plan: MVP for No-Show Prediction

This plan outlines the phases and tasks required to build the MVP.

## Phase 1: Data Preparation and Model Training

- [x] **Task:** Set up Google BigQuery instance and define the schema for patient and appointment data.
- [x] **Task:** Write a data loading script to ingest the existing anonymized dataset into BigQuery.
- [x] **Task:** Develop a Python script for data exploration, cleaning, and feature engineering.
- [x] **Task:** Write Tests for the data processing script.
- [x] **Task:** Train an initial version of the no-show prediction model (e.g., Logistic Regression) using Scikit-learn.
- [x] **Task:** Write tests to evaluate the model's performance (e.g., accuracy, precision, recall).
- [x] **Task:** Conductor - User Manual Verification 'Phase 1: Data Preparation and Model Training' (Protocol in workflow.md)

## Phase 2: Backend and API Development

- [x] **Task:** Create a Google Cloud Function in Python to serve the trained model as an API.
    - [x] Sub-task: The function should accept appointment data and return a no-show probability.
- [x] **Task:** Write unit tests for the model deployment API.
- [ ] **Task:** Create a second Cloud Function to act as the main backend API for the frontend.
    - [ ] Sub-task: This API will fetch appointment data from BigQuery.
    - [ ] Sub-task: It will call the model API to get predictions.
    - [ ] Sub-task: It will format the data for the dashboard.
- [ ] **Task:** Write integration tests for the backend API.
- [ ] **Task:** Conductor - User Manual Verification 'Phase 2: Backend and API Development' (Protocol in workflow.md)

## Phase 3: Frontend Dashboard

- [ ] **Task:** Set up a new React application using Create React App.
- [ ] **Task:** Create a component to display the list of upcoming appointments.
    - [ ] Sub-task: The component should fetch data from the backend API.
- [ ] **Task:** Write tests for the appointment list component.
- [ ] **Task:** Implement the color-coding for the no-show probability score.
- [ ] **Task:** Add the "Find Backup" button to high-risk appointments.
- [ ] **Task:** Create a modal or panel to display the backup patient suggestions returned by the ADK agent.
- [ ] **Task:** Write tests for the backup suggestion UI.
- [ ] **Task:** Conductor - User Manual Verification 'Phase 3: Frontend Dashboard' (Protocol in workflow.md)

## Phase 4: ADK Agent Integration

- [ ] **Task:** Design the ADK agent responsible for finding backup patients.
- [ ] **Task:** Implement the agent in Python.
    - [ ] Sub-task: The agent will query the waitlist in BigQuery.
    - [ ] Sub-task: It will apply filtering logic to find suitable candidates.
- [ ] **Task:** Write tests for the backup patient agent.
- [ ] **Task:** Integrate the agent with the frontend so that the "Find Backup" button triggers the agent.
- [ ] **Task:** Write end-to-end tests for the full workflow.
- [ ] **Task:** Conductor - User Manual Verification 'Phase 4: ADK Agent Integration' (Protocol in workflow.md)
