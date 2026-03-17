import json
import random

first_names = ["James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Christopher", "Karen"]
last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"]

with open('backend/patients_3_weeks.json', 'r') as f:
    patients = json.load(f)

for p in patients:
    p['name'] = f"{random.choice(first_names)} {random.choice(last_names)}"

with open('backend/patients_3_weeks.json', 'w') as f:
    json.dump(patients, f, indent=4)

print("Updated patient names in backend/patients_3_weeks.json")
