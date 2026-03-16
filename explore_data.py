import pandas as pd

def explore_data(file_path):
    """
    Performs exploratory data analysis on the given dataset.
    """
    # Load the dataset
    df = pd.read_csv(file_path)

    # Print basic information
    print(f"Shape of the dataset: {df.shape}")
    print("\nData types of each column:")
    df.info()

    # Check for missing values
    print("\nMissing values in each column:")
    print(df.isnull().sum())

    # Show summary statistics
    print("\nSummary statistics for numerical columns:")
    print(df.describe())

    # Show distribution of the target variable
    print("\nDistribution of 'no_show':")
    print(df['no_show'].value_counts(normalize=True))

if __name__ == "__main__":
    explore_data("hospital_longitudinal_data.csv")
