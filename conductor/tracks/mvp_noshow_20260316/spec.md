# Specification: MVP for No-Show Prediction and Backup Suggestion

## 1. Overview

This document specifies the requirements for the Minimum Viable Product (MVP) of the Hospital No-Show Prediction System. The goal is to build the core functionality that allows a hospital scheduler to see the probability of a patient missing their appointment and to receive a suggestion for a backup patient.

## 2. Key Features

### 2.1. No-Show Probability Score
- The system will display a probability score (from 0% to 100%) next to each upcoming appointment on the main dashboard.
- This score will be calculated by a machine learning model.
- The score will be color-coded for easy identification:
    - Green: Low risk (0-30%)
    - Yellow: Medium risk (31-70%)
    - Red: High risk (71-100%)

### 2.2. Backup Patient Suggestion
- For appointments flagged as "High risk," the system will present a "Find Backup" button.
- Clicking this button will trigger an ADK agent to search a pre-defined patient waitlist.
- The agent will return the top 3 most suitable candidates based on criteria such as availability and proximity.
- The scheduler can then initiate contact with the suggested patients.

## 3. Technical Requirements

### 3.1. Data & Model
- The system will use an existing, anonymized dataset of patient and appointment history for the initial model training.
- The model will be developed in Python using Scikit-learn or a similar library.
- The trained model will be exposed as an API endpoint on Google Cloud AI Platform.

### 3.2. Architecture
- The system will be built on a serverless architecture using Google Cloud Functions for backend logic.
- ADK (Agent Development Kit) agents will be used to manage the workflow between the frontend, the model, and the database.
- The frontend dashboard will be a single-page application built with React.
- Data will be stored in Google BigQuery.

## 4. Acceptance Criteria

- A scheduler can log in and view a dashboard of the upcoming week's appointments.
- Every appointment on the dashboard displays a no-show probability score.
- A user can click a button on a high-risk appointment to receive a list of 3 potential backup patients.
- All patient data remains secure and anonymized throughout the process.
