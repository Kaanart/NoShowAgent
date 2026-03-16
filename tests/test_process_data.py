import pandas as pd
import numpy as np
import pytest
import os
import sys

# Add scripts directory to path to import process_data
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from scripts.process_data import clean_data, feature_engineering

@pytest.fixture
def sample_data():
    appointments = pd.DataFrame({
        'appointment_id': ['A1', 'A2', 'A3'],
        'patient_id': ['P1', 'P2', 'P3'],
        'appointment_datetime': ['2026-03-20 09:00:00', '2026-03-21 10:30:00', '2026-03-22 14:00:00'],
        'clinic_id': ['C1', 'C1', 'C2'],
        'provider_id': ['DR1', 'DR1', 'DR2'],
        'appointment_type': ['Checkup', None, 'Consultation'],
        'status': ['Scheduled', 'Scheduled', 'No-Show'],
        'no_show': [False, False, True]
    })
    
    patients = pd.DataFrame({
        'patient_id': ['P1', 'P2', 'P3'],
        'age': [30, None, 50],
        'gender': ['M', 'F', None],
        'distance_to_clinic': [5.0, 10.0, None],
        'historical_no_show_rate': [0.1, 0.0, 0.5],
        'waitlist_status': [False, False, False]
    })
    
    return appointments, patients

def test_clean_data(sample_data):
    appointments, patients = sample_data
    cleaned_df = clean_data(appointments, patients)
    
    # Check that lengths are the same since all have labels
    assert len(cleaned_df) == 3
    
    # Check filling of missing values
    assert not cleaned_df['age'].isnull().any()
    assert not cleaned_df['distance_to_clinic'].isnull().any()
    assert not cleaned_df['appointment_type'].isnull().any()
    
    # Specific expected values based on median/fill logic
    assert cleaned_df.loc[cleaned_df['patient_id'] == 'P2', 'appointment_type'].iloc[0] == 'General'
    assert cleaned_df.loc[cleaned_df['patient_id'] == 'P3', 'gender'].iloc[0] == 'Unknown'

def test_feature_engineering(sample_data):
    appointments, patients = sample_data
    cleaned_df = clean_data(appointments, patients)
    engineered_df = feature_engineering(cleaned_df)
    
    # Ensure dropped columns are gone
    assert 'appointment_id' not in engineered_df.columns
    assert 'patient_id' not in engineered_df.columns
    
    # Check new time features
    assert 'hour' in engineered_df.columns
    assert 'day_of_week' in engineered_df.columns
    assert 'month' in engineered_df.columns
    
    # Check boolean cast
    assert engineered_df['no_show'].dtype == int
