# NoShowAgent: Hospital No-Show Prediction System

![NoShowAgent Banner](https://via.placeholder.com/800x200.png?text=NoShowAgent)

## Overview

**NoShowAgent** is a smart scheduling system designed for hospitals to proactively reduce revenue loss and inefficiencies caused by patient no-shows. Driven by a network of autonomous agents (built with ADK), the system leverages machine learning to identify high-risk appointments and enables hospital staff to efficiently fill those slots with suitable backup patients.

By ensuring a consistently full schedule, NoShowAgent helps optimize resource allocation and improve overall hospital operations.

## Key Features

*   **No-Show Probability Analysis:** Every upcoming appointment is evaluated by an ML model (trained on historical patient data) to generate a "no-show probability score". Scores are color-coded for quick assessment:
    *   🟢 **Green:** Low risk (0-30%)
    *   🟡 **Yellow:** Medium risk (31-70%)
    *   🔴 **Red:** High risk (71-100%)
*   **Automated Backup Patient Management:** When an appointment is flagged as high-risk, an automated agent continuously monitors the schedule and searches a pre-vetted waitlist for suitable backup candidates.
*   **Smart Suggestions:** The system presents the top 3 most suitable backup patients based on criteria like availability and proximity, allowing the scheduler to quickly initiate contact and fill the slot.
*   **Interactive Dashboard:** A modular and responsive user interface designed specifically for hospital staff (receptionists, schedulers, and administrative personnel) to seamlessly integrate into their daily workflows.

## Technology Stack

The project is built entirely on Google Cloud, utilizing modern web and ML technologies:

*   **Frontend:** React (Single Page Application) with standard CSS.
*   **Backend & API:** Python, Google Cloud Functions, and Cloud Run (Serverless architecture).
*   **Machine Learning:** Scikit-learn, deployed on Google Cloud AI Platform.
*   **Database / Data Warehouse:** Google BigQuery for highly scalable data storage and complex querying.
*   **Agents:** ADK (Agent Development Kit) for orchestrating workflows between the frontend, the ML model, and the database.

## Architecture

The system follows a serverless architecture on Google Cloud:
1.  **Frontend Dashboard** (React) interacts with the backend APIs.
2.  **Backend APIs** (Cloud Functions/Cloud Run) handle requests, authentication, and data retrieval.
3.  **ML Inference API** (AI Platform) serves the no-show probability predictions.
4.  **BigQuery** stores all anonymized patient and appointment historical data.
5.  **ADK Agents** run asynchronously to find backup patients when high-risk appointments are identified.

## Project Structure

```text
NoShowAgent/
├── cloud_functions/   # Backend APIs and Agent logic (Python)
├── conductor/         # Product definitions, specifications, and planning
├── data/              # Mock datasets for testing and training
├── frontend/          # React application source code
├── schema/            # Database schemas for BigQuery
├── scripts/           # Utility scripts for data generation and model training
└── tests/             # Automated test suite
```

## Getting Started

### Prerequisites
*   **Python 3.8+**
*   **Node.js & npm**
*   **Google Cloud CLI (`gcloud`)** installed and configured

### 1. Local Environment Setup (Python Backend & Scripts)

Clone the repository and install the main Python dependencies:

```bash
git clone <repository-url>
cd NoShowAgent
python3 -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
pip install -r requirements.txt
```

*(Note: The `cloud_functions` directories contain their own specific `requirements.txt` files for deployment).*

### 2. Frontend Setup (React)

Navigate to the `frontend` directory and start the development server:

```bash
cd frontend
npm install
npm start
```
The dashboard will be available at [http://localhost:3000](http://localhost:3000).

### 3. Data & Model Preparation

Use the provided scripts to generate synthetic data and train the initial No-Show prediction model:

```bash
# Generate synthetic dataset for testing
python scripts/generate_synthetic_data.py

# Train the model locally
python scripts/train_synthetic.py
```

### 4. Google Cloud Deployment

*Deployment details for Cloud Functions, BigQuery setup, and AI platform to be documented based on your GCP environment.*

## License

This project is licensed under the [LICENSE](./LICENSE) file included in the repository.
