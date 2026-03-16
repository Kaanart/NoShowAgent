import pandas as pd
from sklearn.model_selection import train_test_split

def prepare_data(file_path):
    """
    Prepares the data for machine learning.
    """
    # Load the dataset
    df = pd.read_csv(file_path)

    # Convert 'appointment_date' to datetime
    df['appointment_date'] = pd.to_datetime(df['appointment_date'])

    # Create 'day_of_week' feature
    df['day_of_week'] = df['appointment_date'].dt.dayofweek

    # Drop the original 'appointment_date' column
    df = df.drop(columns=['appointment_date'])

    # Split the data into features (X) and target (y)
    X = df.drop(columns=['no_show'])
    y = df['no_show']

    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    # Save the training and testing sets
    train_df = pd.concat([X_train, y_train], axis=1)
    test_df = pd.concat([X_test, y_test], axis=1)

    train_df.to_csv('train.csv', index=False)
    test_df.to_csv('test.csv', index=False)

    print("✅ Data preparation complete. train.csv and test.csv created.")

if __name__ == "__main__":
    prepare_data("hospital_longitudinal_data.csv")
