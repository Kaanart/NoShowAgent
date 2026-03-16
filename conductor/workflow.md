# Conductor Workflow

This document outlines the standard operating procedures for development in this project. All autonomous agents and human developers must adhere to these guidelines to ensure consistency, quality, and smooth collaboration.

## 1. Core Principles

- **Test-Driven Development (TDD):** All new features, bug fixes, or refactoring must be accompanied by a comprehensive suite of tests. No code will be integrated without passing tests.
- **Incremental Commits:** Work should be committed frequently in small, logical units. Each commit must be associated with a specific task in the project plan.
- **Clear Documentation:** Code should be self-documenting where possible. Complex logic or non-obvious design choices must be explained with clear, concise comments.

## 2. Development Lifecycle

### Phase 1: Planning & Specification
1.  **Track Definition:** A new `track` is created for any significant unit of work (feature, bug, epic).
2.  **Specification (`spec.md`):** A detailed specification is written, outlining the goals, requirements, and acceptance criteria.
3.  **Implementation Plan (`plan.md`):** The specification is broken down into a series of concrete, actionable tasks.

### Phase 2: Implementation
1.  **Task Execution:** Developers (human or AI) execute tasks from the `plan.md`.
2.  **Testing:**
    -   **Unit Tests:** Each new piece of functionality must have corresponding unit tests.
    -   **Integration Tests:** The interaction between different components must be tested.
    -   **Code Coverage:** All new code must maintain a minimum of **80% test coverage**.
3.  **Committing:**
    -   Changes are committed **per task**.
    -   Commit messages must follow the Conventional Commits specification and reference the associated track ID.

### Phase 3: Review & Completion
1.  **Pull Request:** Once all tasks in a track are complete, a pull request is opened.
2.  **Code Review:** The code is reviewed for quality, correctness, and adherence to guidelines.
3.  **Merge:** Upon approval, the code is merged into the main branch.

## 3. Phase Completion Verification and Checkpointing Protocol

At the end of each **Phase** outlined in a `plan.md`, the following manual verification protocol must be executed:

1.  **User Verification:** The user (or a designated QA team member) must manually verify that the functionality implemented in the phase meets all requirements and acceptance criteria defined in the `spec.md`.
2.  **Checkpoint Commit:** Once verification is successful, a checkpoint commit will be created with the message: `conductor(checkpoint): Phase '<Phase Name>' completed and verified`.
3.  **Proceed:** Only after this checkpoint is created can work on the next phase begin.
