import pandas as pd

df = pd.read_csv("data.csv")

def label(row):
    score = 0

    if row["temperature"] > 95:
        score += 60
    elif row["temperature"] > 80:
        score += 30

    if row["runtime"] > 2200:
        score += 30

    if row["vibration"] > 6:
        score += 40

    if score >= 80:
        return "PANNE"
    elif score >= 40:
        return "RISQUE"
    else:
        return "OK"

df["label"] = df.apply(label, axis=1)

df.to_csv("dataset_labeled.csv", index=False)

print("✅ Done: dataset_labeled.csv created")