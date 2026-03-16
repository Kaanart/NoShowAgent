import os
import pickle
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, classification_report
import sys

# Add scripts directory to path to import process_data
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
from process_data import process_pipeline

def train_and_evaluate_model(X, y):
    """
    Trains a Logistic Regression model and prints evaluation metrics.
    """
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = LogisticRegression(max_iter=1000, class_weight='balanced')
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    
    metrics = {
        'accuracy': accuracy_score(y_test, y_pred),
        'precision': precision_score(y_test, y_pred, zero_division=0),
        'recall': recall_score(y_test, y_pred, zero_division=0)
    }
    
    print("Model Evaluation:")
    print(classification_report(y_test, y_pred, zero_division=0))
    
    return model, metrics

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    app_path = os.path.join(base_dir, "data", "mock_appointments.csv")
    pat_path = os.path.join(base_dir, "data", "mock_patients.csv")
    
    df = process_pipeline(app_path, pat_path)
    
    if df is None or len(df) == 0:
        print("Data processing failed or dataset is empty.")
        return
        
    X = df.drop('no_show', axis=1)
    y = df['no_show']
    
    print("Training model...")
    model, metrics = train_and_evaluate_model(X, y)
    
    # Ensure models directory exists
    models_dir = os.path.join(base_dir, "models")
    os.makedirs(models_dir, exist_ok=True)
    
    model_path = os.path.join(models_dir, "noshow_model.pkl")
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    main()
