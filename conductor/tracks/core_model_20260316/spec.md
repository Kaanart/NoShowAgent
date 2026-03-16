# Specification: Build core MRI no-show prediction model and interactive dashboard

## Objective
Develop the foundational prediction model and the interactive scheduler dashboard to accurately predict and manage patient no-shows.

## Context
- **Product:** MRI no-show prediction system.
- **Key Features:** Interactive Dashboard, Waitlist Auto-Promote.
- **Constraints:** HIPAA Compliance, BigQuery Integration.

## Requirements
1. **Prediction Model (Backend/Python):**
   - Implement ML model serving using FastAPI/Django.
   - Fetch base data and push updates/metrics to Google Cloud BigQuery.
2. **Interactive Dashboard (Frontend/TypeScript):**
   - Develop a React UI that displays a prioritized risk ranking of appointments.
   - Show patient history and highlight confirmed or canceled slots.
   - Provide an actionable interface to auto-promote waitlisted patients.