import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import os

# Configuration
NUM_PATIENTS = 10000
START_DATE_TRAIN = datetime(2024, 1, 1)
END_DATE_TRAIN = datetime(2026, 3, 17)
START_DATE_PRED = END_DATE_TRAIN
END_DATE_PRED = START_DATE_PRED + timedelta(days=14)
APPT_TYPES = ['Checkup', 'Consultation', 'Follow-up', 'Therapy', 'Surgery Prep', 'MRI Scan']

def calculate_probability(ratio, distance, age, days_created):
    """Injects some signal so the ML model has patterns to learn."""
    logit = -1.5 # Base logit for roughly ~40% average (lowered due to additive modifiers)
    
    if ratio > 0:
        logit += (ratio - 0.4) * 3.5  # High historical no-show is a strong predictor
    
    if distance > 20:
        logit += 0.6  # Far away = higher chance
    
    if age < 30:
        logit += 0.3  # Younger = slightly higher chance
        
    if days_created > 30:
        logit += 0.5  # Booked long ago = higher chance to forget
        
    return 1 / (1 + np.exp(-logit))

def main():
    print("Generating 10,000 patients...")
    np.random.seed(42)
    random.seed(42)
    
    patient_ids = [f"P{str(i).zfill(5)}" for i in range(1, NUM_PATIENTS + 1)]
    
    # Normal distributions for demographics
    ages = np.clip(np.random.normal(loc=45, scale=20, size=NUM_PATIENTS), 18, 95).astype(int)
    distances = np.clip(np.random.normal(loc=15, scale=10, size=NUM_PATIENTS), 0.5, 75).round(1)

    patients_df = pd.DataFrame({
        'patient_id': patient_ids,
        'age': ages,
        'distance_to_location': distances
    })

    print("Simulating historical appointments (Training Data)...")
    train_appts = []
    
    # 1 to 10 appointments per patient over the 2+ years
    num_appts_per_patient = np.random.randint(1, 11, size=NUM_PATIENTS)
    
    for i, p_id in enumerate(patient_ids):
        num_appts = num_appts_per_patient[i]
        age = ages[i]
        distance = distances[i]
        
        # Random chronologically sorted dates
        random_days = np.random.randint(0, (END_DATE_TRAIN - START_DATE_TRAIN).days, size=num_appts)
        dates = sorted([START_DATE_TRAIN + timedelta(days=int(d)) for d in random_days])
        
        prev_no_shows = 0
        last_date = None
        
        for j, date in enumerate(dates):
            days_since_created = np.random.randint(1, 90)
            days_since_last = (date - last_date).days if last_date else 0
            no_show_ratio = prev_no_shows / j if j > 0 else 0.0
            
            # Calculate probability based on features to ensure the ML works
            prob = calculate_probability(no_show_ratio, distance, age, days_since_created)
            is_no_show = 1 if random.random() < prob else 0
            
            train_appts.append({
                'patient_id': p_id,
                'appointment_date': date.strftime('%Y-%m-%d'),
                'age': age,
                'distance_to_location': distance,
                'days_since_appointment_created': days_since_created,
                'days_since_last_appointment': days_since_last,
                'prev_no_show_count': prev_no_shows,
                'no_show_ratio': round(no_show_ratio, 3),
                'appointment_type': random.choice(APPT_TYPES),
                'actual_show_or_no_show': is_no_show
            })
            
            prev_no_shows += is_no_show
            last_date = date

    train_df = pd.DataFrame(train_appts)
    
    actual_ratio = train_df['actual_show_or_no_show'].mean()
    print(f"Total training appointments generated: {len(train_df)}")
    print(f"Overall No-Show Ratio in Training Data: {actual_ratio:.2%}")

    print("Generating future appointments (Prediction Data)...")
    # Let's schedule future appointments for about 15% of the patients
    future_patients = np.random.choice(patient_ids, size=int(NUM_PATIENTS * 0.15), replace=False)
    
    pred_appts = []
    # Pre-calculate totals for fast lookup
    last_state = train_df.groupby('patient_id').last().reset_index()
    last_state_dict = last_state.set_index('patient_id').to_dict('index')
    patient_counts = train_df.groupby('patient_id').size().to_dict()

    for p_id in future_patients:
        # Date between 2026-03-17 and 2026-03-31
        date = START_DATE_PRED + timedelta(days=np.random.randint(1, 15))
        days_since_created = np.random.randint(1, 60)
        
        patient_row = patients_df[patients_df['patient_id'] == p_id].iloc[0]
        age = patient_row['age']
        distance = patient_row['distance_to_location']
        
        hist = last_state_dict.get(p_id)
        if hist:
            last_date = datetime.strptime(hist['appointment_date'], '%Y-%m-%d')
            days_since_last = (date - last_date).days
            
            # Incorporate the result of their very last appointment
            prev_no_shows = hist['prev_no_show_count'] + hist['actual_show_or_no_show']
            total_appts = patient_counts.get(p_id, 0)
            no_show_ratio = prev_no_shows / total_appts if total_appts > 0 else 0.0
        else:
            days_since_last = 0
            prev_no_shows = 0
            no_show_ratio = 0.0
            
        pred_appts.append({
            'patient_id': p_id,
            'appointment_date': date.strftime('%Y-%m-%d'),
            'age': age,
            'distance_to_location': distance,
            'days_since_appointment_created': days_since_created,
            'days_since_last_appointment': days_since_last,
            'prev_no_show_count': prev_no_shows,
            'no_show_ratio': round(no_show_ratio, 3),
            'appointment_type': random.choice(APPT_TYPES),
            'actual_show_or_no_show': -1 # Unknown for future
        })

    pred_df = pd.DataFrame(pred_appts)
    print(f"Total prediction appointments generated: {len(pred_df)}")

    os.makedirs('data', exist_ok=True)
    train_df.to_csv('data/synthetic_training_data.csv', index=False)
    pred_df.to_csv('data/synthetic_prediction_data.csv', index=False)
    print("Files successfully saved to data/synthetic_training_data.csv and data/synthetic_prediction_data.csv")

if __name__ == '__main__':
    main()
