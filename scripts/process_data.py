import pandas as pd
import numpy as np

def clean_data(appointments_df, patients_df):
    """
    Cleans and merges appointments and patients data.
    """
    # Merge datasets
    df = pd.merge(appointments_df, patients_df, on="patient_id", how="left")
    
    # Drop rows without labels for historical training
    df = df.dropna(subset=['no_show'])
    
    # Fill missing categorical values
    df['gender'] = df['gender'].fillna('Unknown')
    df['appointment_type'] = df['appointment_type'].fillna('General')
    
    # Fill missing numerical values with median
    df['age'] = df['age'].fillna(df['age'].median())
    df['distance_to_clinic'] = df['distance_to_clinic'].fillna(df['distance_to_clinic'].median())
    
    return df

def feature_engineering(df):
    """
    Engineers new features from the cleaned dataset.
    """
    df['appointment_datetime'] = pd.to_datetime(df['appointment_datetime'])
    
    # Extract temporal features
    df['hour'] = df['appointment_datetime'].dt.hour
    df['day_of_week'] = df['appointment_datetime'].dt.dayofweek
    df['month'] = df['appointment_datetime'].dt.month
    
    # One-hot encoding for categorical columns
    categorical_cols = ['gender', 'appointment_type', 'clinic_id']
    df = pd.get_dummies(df, columns=categorical_cols, drop_first=True)
    
    # Drop columns that are no longer needed
    df = df.drop(['appointment_id', 'patient_id', 'appointment_datetime', 'provider_id', 'status'], axis=1)
    
    # Ensure no_show is a boolean/integer
    df['no_show'] = df['no_show'].astype(int)
    
    return df

def process_pipeline(appointments_path, patients_path):
    """
    Full pipeline to load, clean, and engineer features.
    """
    try:
        app_df = pd.read_csv(appointments_path)
        pat_df = pd.read_csv(patients_path)
    except Exception as e:
        print(f"Error loading data: {e}")
        return None
        
    cleaned_df = clean_data(app_df, pat_df)
    final_df = feature_engineering(cleaned_df)
    
    return final_df

if __name__ == "__main__":
    import os
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    app_path = os.path.join(base_dir, "data", "mock_appointments.csv")
    pat_path = os.path.join(base_dir, "data", "mock_patients.csv")
    
    processed_df = process_pipeline(app_path, pat_path)
    if processed_df is not None:
        print(f"Data processed successfully. Shape: {processed_df.shape}")
        print(processed_df.head())
