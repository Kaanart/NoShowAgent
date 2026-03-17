import json
from datetime import datetime, timedelta

def get_start_of_week(dt):
    return dt - timedelta(days=dt.weekday())

now = datetime.now()
start_of_this_week = get_start_of_week(now)
# We want 3 weeks total (this week, next week, the week after)

patients_data = []
patient_id_counter = 1

# Generate appointments with non-overlapping timings
for week in range(3):
    for day in range(5): # Monday to Friday
        current_day = start_of_this_week + timedelta(weeks=week, days=day)
        # 4 appointments a day, non-overlapping
        for hour in [9, 11, 13, 15]:
            patients_data.append({
                "id": f"P{patient_id_counter}",
                "name": f"Patient {patient_id_counter}",
                "date": current_day.strftime("%Y-%m-%d"),
                "time": f"{hour:02d}:00",
                "distance": round(1.0 + (patient_id_counter * 0.1), 1),
                "historical_no_show_rate": round(0.01 * (patient_id_counter % 20), 2)
            })
            patient_id_counter += 1

with open('backend/patients_3_weeks.json', 'w') as f:
    json.dump(patients_data, f, indent=4)

print("Data generated in backend/patients_3_weeks.json")
