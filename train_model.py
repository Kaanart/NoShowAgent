import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from imblearn.over_sampling import SMOTE

def train_model():
    """
    Trains a Logistic Regression model and evaluates it.
    """
    # Load the datasets
    train_df = pd.read_csv('train.csv')
    test_df = pd.read_csv('test.csv')

    # Split the data into features (X) and target (y)
    X_train = train_df.drop(columns=['no_show'])
    y_train = train_df['no_show']
    X_test = test_df.drop(columns=['no_show'])
    y_test = test_df['no_show']

    # Apply SMOTE to the training data
    smote = SMOTE(random_state=42)
    X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)

    # Initialize and train the model on the resampled data
    model = LogisticRegression(random_state=42, solver='liblinear')
    model.fit(X_train_resampled, y_train_resampled)

    # Make predictions on the test set
    y_pred = model.predict(X_test)

    # Evaluate the model
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)

    # Print the evaluation metrics
    print("Model Evaluation Metrics (with SMOTE):")
    print(f"  Accuracy: {accuracy:.4f}")
    print(f"  Precision: {precision:.4f}")
    print(f"  Recall: {recall:.4f}")
    print(f"  F1-score: {f1:.4f}")

if __name__ == "__main__":
    train_model()
