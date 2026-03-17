import pandas as pd
import pickle
import os
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    # If run from the workspace root, __file__ might be NoShowAgent\scripts\train_synthetic.py
    # So base_dir is NoShowAgent
    train_path = os.path.join(base_dir, 'data', 'synthetic_training_data.csv')
    if not os.path.exists(train_path):
        # Fallback to local
        train_path = 'data/synthetic_training_data.csv'
    
    print("Loading training data...")
    df = pd.read_csv(train_path)
    
    # We will use the numerical features for simplicity in the MVP
    features = [
        'age', 
        'distance_to_location', 
        'days_since_appointment_created', 
        'days_since_last_appointment', 
        'prev_no_show_count', 
        'no_show_ratio'
    ]
    
    X = df[features]
    y = df['actual_show_or_no_show']
    
    print("Training model...")
    # class_weight='balanced' helps deal with any class imbalance
    model = LogisticRegression(max_iter=1000, class_weight='balanced')
    model.fit(X, y)
    
    # Quick evaluation on train set
    y_pred = model.predict(X)
    print("Training Performance:")
    print(classification_report(y, y_pred))
    
    # Save the model directly into the model_api folder where the API expects it
    model_api_dir = os.path.join(base_dir, 'cloud_functions', 'model_api')
    os.makedirs(model_api_dir, exist_ok=True)
    model_path = os.path.join(model_api_dir, 'noshow_model.pkl')
    
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
        
    print(f"Model successfully saved to {model_path}")

if __name__ == '__main__':
    main()
