# Technology Stack

This document outlines the technology stack for the Hospital No-Show Prediction System, which will be built entirely on Google Cloud, leveraging Python as the primary development language.

## 1. Programming Language

*   **Python:** The sole programming language for backend services, data processing, and machine learning. Its extensive libraries (Pandas, Scikit-learn, TensorFlow/PyTorch) and strong integration with Google Cloud services make it the ideal choice for all components of the project.

## 2. Backend & ML Platform

*   **Google Cloud:** The entire application will be built and deployed on Google Cloud.
    *   **Compute:** Cloud Functions and Cloud Run will be used for serverless backend logic and hosting the ML model endpoints.
    *   **AI Platform:** Google Cloud's AI Platform will be used for training, versioning, and deploying the no-show prediction model.

## 3. Frontend

*   **Dashboard:** The user-facing dashboard for hospital staff will be built using **React**. Its component-based architecture will allow for the creation of a modular and responsive user interface to display schedules and prediction data. The frontend will be hosted on Firebase Hosting or Google App Engine.

## 4. Database

*   **Data Warehouse:** Patient and appointment data will be stored in **Google BigQuery**. As a serverless, highly scalable data warehouse, it is perfectly suited for handling the large datasets required for training the ML model and running fast, complex queries for the dashboard.
