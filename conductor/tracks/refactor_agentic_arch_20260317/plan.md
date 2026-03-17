# Implementation Plan: Refactor to Google Cloud Agentic Architecture

## Phase 1: Foundational Setup & Backend Core Migration

- [x] Task: Set up the new agentic backend project structure. [bcf207a]
    - [x] Initialize a new Python project with the Vertex AI Agent Development Kit (ADK).
    - [x] Establish a testing framework and initial CI configuration.
- [ ] Task: Migrate the core Risk Engine logic.
    - [ ] Write Tests to validate the behavior of the original risk engine.
    - [ ] Implement the Risk Engine agent/tool using the ADK.
    - [ ] Write integration tests for the new agent against the existing data models.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Foundational Setup & Backend Core Migration' (Protocol in workflow.md)

## Phase 2: Data Services Migration & UI Integration

- [ ] Task: Migrate data ingestion and backup agent services.
    - [ ] Write Tests to cover the existing data ingestion and backup functionalities.
    - [ ] Implement agents/tools for data ingestion and backup processes within the ADK framework.
    - [ ] Write integration tests to ensure the new agents interact correctly with BigQuery.
- [ ] Task: Integrate the frontend with the new agentic backend.
    - [ ] Write Tests to mock and validate the frontend's interaction with the new API endpoints.
    - [ ] Implement a BFF (Backend-For-Frontend) or API Gateway if necessary to adapt the agentic API to the UI's needs.
    - [ ] Update frontend configuration to point to the new backend endpoints.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Data Services Migration & UI Integration' (Protocol in workflow.md)

## Phase 3: Deployment Preparation & Final Verification

- [ ] Task: Create deployment manifests for Cloud Run.
    - [ ] Write the `Dockerfile` for the new agentic backend service.
    - [ ] Create the `service.yaml` and any other necessary configuration files for deployment via App Design Center.
- [ ] Task: Conduct end-to-end testing and ensure UI parity.
    - [ ] Write comprehensive end-to-end tests for the critical user flows.
    - [ ] Execute manual testing to verify that all UI elements and interactions function identically to the pre-refactor system.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Deployment Preparation & Final Verification' (Protocol in workflow.md)