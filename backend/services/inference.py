import pandas as pd
import numpy as np
import torch
import torch.nn as nn
import joblib
import json
from datetime import datetime

# ---------------- CONFIG ----------------
CSV_PATH = "backend/data/ward_pollution_history.csv"
MODEL_PATH = "backend/ml/stgcn_model.pth"
ADJ_PATH = "backend/ml/adj_norm.pt"
SCALER_PATH = "backend/ml/scaler.pkl"
OUTPUT_PATH = "backend/data/gcn_output.json"

WINDOW = 5
FEATURES = ['aqi','pm25','pm10','no2','so2','o3','co']
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

timestamp = datetime.now().astimezone().isoformat()

# ---------------- MODEL ----------------
class STGCN_AQI(nn.Module):
    def __init__(self, in_c, out_c):
        super().__init__()
        self.conv = nn.Conv1d(in_c, 16, 3, padding=1)
        self.w = nn.Parameter(torch.randn(16, 16))
        self.fcn = nn.Linear(16, out_c)

    def forward(self, x, adj):
        B, T, N, C = x.shape
        x = torch.relu(
            self.conv(
                x.permute(0,2,3,1).reshape(B*N, C, T)
            )
        )
        x = x.reshape(B, N, 16, T).permute(0,3,1,2)
        x = torch.relu(adj @ (x @ self.w))
        return self.fcn(x[:, -1])


# ---------------- LOAD ARTIFACTS ----------------
model = STGCN_AQI(7,7).to(DEVICE)
model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
model.eval()

adj_norm = torch.load(ADJ_PATH, map_location=DEVICE)
scaler = joblib.load(SCALER_PATH)


# ---------------- INFERENCE ----------------
def run_stgcn_inference():
    df = pd.read_csv(CSV_PATH)
    df['computed_at'] = pd.to_datetime(df['computed_at'])

    with open("backend/ml/ward_order.json", "r") as f:
        ward_order = json.load(f)

    N = len(ward_order)

    timestamps = sorted(df['computed_at'].unique())[-WINDOW:]
    df = df[df['computed_at'].isin(timestamps)]

    X = np.zeros((1, WINDOW, N, len(FEATURES)))

    for t, ts in enumerate(timestamps):
        snap = (
            df[df['computed_at'] == ts]
            .groupby('ward_name')[FEATURES]
            .mean()
        )

        for n, ward in enumerate(ward_order):
            if ward in snap.index:
                X[0, t, n] = snap.loc[ward, FEATURES].values

    # scale
    X_flat = pd.DataFrame(
        X.reshape(-1, len(FEATURES)),
        columns=FEATURES
    )

    X = scaler.transform(X.reshape(-1, len(FEATURES))).reshape(X.shape)
    X = torch.FloatTensor(X).to(DEVICE)

    with torch.no_grad():
        y_scaled = model(X, adj_norm.to(DEVICE))

    y = scaler.inverse_transform(
        y_scaled.cpu().numpy().reshape(-1, len(FEATURES))
    ).reshape(1, N, len(FEATURES))

    # API friendly output
    output = []

    for i, ward in enumerate(ward_order):
        output.append({
            "ward_name": ward,
            "aqi": float(y[0, i, 0]),
            "pollutants": {
                "pm25": float(y[0, i, 1]),
                "pm10": float(y[0, i, 2]),
                "no2": float(y[0, i, 3]),
                "so2": float(y[0, i, 4]),
                "o3": float(y[0, i, 5]),
                "co": float(y[0, i, 6])
            },
            "computed_at": timestamp
        })

    with open(OUTPUT_PATH, "w") as f:
        json.dump(output, f, indent=2)

    print(f"✅ GCN output saved to {OUTPUT_PATH}")

    return output

if __name__ == "__main__" :
    run_stgcn_inference()