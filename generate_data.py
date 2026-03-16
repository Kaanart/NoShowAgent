import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Configuration
np.random.seed(42)
num_patients = 2000  # Unique individuals
filename = 'hospital_longitudinal_data.csv'

def generate_longitudinal_data(n_patients):
    # --- 1. GENERATE STATIC PATIENT ATTRIBUTES ---
    # Age: Bimodal (Young adults and Seniors)
    group_a = np.random.normal(25, 10, int(n_patients * 0.4))
    group_b = np.random.normal(70, 12, int(n_patients * 0.6))
    ages = np.clip(np.concatenate([group_a, group_b]), 0, 100).astype(int)
    
    # Distance: Log-normal (Most live close)
    distances = np.clip(np.random.lognormal(mean=2, sigma=0.8, size=n_patients), 0.5, 100).round(2)
    
    patient_ids = np.arange(1000, 1000 + n_patients)
    
    patient_list = []

    # --- 2. GENERATE MULTIPLE APPOINTMENTS PER PATIENT ---
    for i in range(n_patients):
        p_id = patient_ids[i]
        p_age = ages[i]
        p_dist = distances[i]
        
        # Each patient has between 1 and 10 appointments (Poisson)
        num_apps = max(1, np.random.poisson(lam=4))
        
        # Start dates over the last 2 years
        start_date = datetime(2024, 1, 1)
        
        # Track history within the loop for THIS patient
        cumulative_no_shows = 0
        
        for app_idx in range(num_apps):
            # Appointment Date: spread out randomly
            app_date = start_date + timedelta(days=np.random.randint(1, 400))
            
            # Feature logic: Special days (holidays/weekends)
            is_special_day = 1 if app_date.weekday() >= 5 else np.random.binomial(1, 0.05)
            
            # CALCULATE RISK (Logits)
            # Higher risk: young age, far distance, special days, and past no-shows
            age_risk = 1.2 if p_age < 35 else 0.2
            history_risk = (cumulative_no_shows / (app_idx + 1)) * 5.0
            
            logits = (
                (p_dist * 0.05) + 
                age_risk + 
                history_risk + 
                (is_special_day * 0.8) - 3.5
            )
            
            prob = 1 / (1 + np.exp(-logits))
            no_show = np.random.binomial(1, prob)
            
            # Save Record
            patient_list.append({
                'patient_id': p_id,
                'appointment_date': app_date,
                'age': p_age,
                'dist_locatie': p_dist,
                'prev_no_show_count': cumulative_no_shows,
                'appointment_number': app_idx + 1,
                'special_day': is_special_day,
                'no_show': no_show
            })
            
            # Update history for the next appointment
            cumulative_no_shows += no_show

    # Create DataFrame
    df = pd.DataFrame(patient_list)
    
    # Sort by patient and date to make it look like a real hospital log
    df = df.sort_values(by=['patient_id', 'appointment_date']).reset_index(drop=True)
    
    # Calculate rolling ratio for the whole dataframe
    df['no_show_ratio'] = (df.groupby('patient_id')['no_show']
                           .shift(1) # Don't include the current result in the feature
                           .fillna(0)
                           .groupby(df['patient_id'])
                           .cumsum() / df['appointment_number'])
    
    return df

# Execution
df = generate_longitudinal_data(num_patients)
df.to_csv(filename, index=False)

print(f"✅ Created {filename}")
print(f"Total Records: {len(df)}")
print(df[['patient_id', 'appointment_date', 'age', 'no_show']].head(10))