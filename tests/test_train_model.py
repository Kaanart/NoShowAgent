import pytest
import pandas as pd
import numpy as np
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from scripts.train_model import train_and_evaluate_model

@pytest.fixture
def synthetic_training_data():
    # Create some basic synthetic features
    X = pd.DataFrame({
        'age': np.random.randint(18, 80, 100),
        'distance_to_clinic': np.random.uniform(1.0, 50.0, 100),
        'historical_no_show_rate': np.random.uniform(0.0, 1.0, 100),
        'hour': np.random.randint(8, 17, 100)
    })
    
    # Target variable mostly correlated with historical_no_show_rate
    y = (X['historical_no_show_rate'] > 0.5).astype(int)
    
    return X, y

def test_train_and_evaluate_model(synthetic_training_data):
    X, y = synthetic_training_data
    
    model, metrics = train_and_evaluate_model(X, y)
    
    assert model is not None
    assert 'accuracy' in metrics
    assert 'precision' in metrics
    assert 'recall' in metrics
    
    # Even on synthetic data, it should return metrics
    assert metrics['accuracy'] >= 0.0 and metrics['accuracy'] <= 1.0
    assert metrics['precision'] >= 0.0 and metrics['precision'] <= 1.0
    assert metrics['recall'] >= 0.0 and metrics['recall'] <= 1.0
