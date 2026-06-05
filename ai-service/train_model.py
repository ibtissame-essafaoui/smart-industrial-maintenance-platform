import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

# 1. load dataset
df = pd.read_csv("dataset_labeled.csv")

# 2. features
X = df[[
    "temperature",
    "runtime",
    "vibration",
    "pressure",
    "humidity",
    "current_value",
    "voltage"
]]

# 3. label
y = df["label"]

# 4. split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 5. model
model = RandomForestClassifier(n_estimators=200)
model.fit(X_train, y_train)

# 6. save model
joblib.dump(model, "model.pkl")

print("✅ Model saved")