import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
import pickle

# Dummy dataset (replace with real dataset)
data = pd.DataFrame({
    "age": np.random.randint(20, 70, 500),
    "bmi": np.random.uniform(18, 40, 500),
    "glucose": np.random.randint(70, 200, 500),
    "bp": np.random.randint(80, 180, 500),
    "heart": np.random.randint(0, 2, 500),
    "diabetes": np.random.randint(0, 2, 500)
})

X = data[["age", "bmi", "glucose", "bp"]]
y_heart = data["heart"]
y_diabetes = data["diabetes"]

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_heart, test_size=0.2)

heart_model = LogisticRegression()
heart_model.fit(X_train, y_train)

diabetes_model = LogisticRegression()
diabetes_model.fit(X_train, y_diabetes[:len(X_train)])

pickle.dump(heart_model, open("model_heart.pkl", "wb"))
pickle.dump(diabetes_model, open("model_diabetes.pkl", "wb"))
pickle.dump(scaler, open("scaler.pkl", "wb"))
