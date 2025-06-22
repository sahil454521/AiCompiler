from fastapi import FastAPI, Request
from pydantic import BaseModel
import joblib
import pandas as pd
import re

app = FastAPI()

clf = joblib.load("model_suggestion_classifier.pkl")
le = joblib.load("label_encoder.pkl")

class CodeInput(BaseModel):
    code: str

def extract_features(snippet):
    lines = snippet.strip().split('\n')
    num_lines = len(lines)
    num_chars = len(snippet)
    avg_line_length = sum(len(line) for line in lines) / num_lines if num_lines > 0 else 0

    num_keywords = len(re.findall(r"\b(def|class|fit|predict|compile|train|model|transform)\b", snippet))
    num_functions = snippet.count("def")
    num_classes = snippet.count("class")

    uses_linear_regression = "LinearRegression" in snippet
    uses_xgboost = "xgboost" in snippet
    uses_tensorflow = "tensorflow" in snippet
    uses_keras = "keras" in snippet
    uses_torch = any(token in snippet for token in [
        "import torch", "torch.nn", "torch.optim", "torch.Tensor", "nn.Module", "F.relu"
    ])
    uses_sklearn = "sklearn" in snippet or "from sklearn" in snippet
    uses_pandas = "pandas" in snippet or "pd.DataFrame" in snippet

    return pd.DataFrame([{
        "num_lines": num_lines,
        "num_chars": num_chars,
        "avg_line_length": avg_line_length,
        "num_keywords": num_keywords,
        "num_functions": num_functions,
        "num_classes": num_classes,
        "uses_linear_regression": uses_linear_regression,
        "uses_xgboost": uses_xgboost,
        "uses_tensorflow": uses_tensorflow,
        "uses_keras": uses_keras,
        "uses_torch": uses_torch,
        "uses_sklearn": uses_sklearn,
        "uses_pandas": uses_pandas
    }])

@app.post("/suggest")
async def suggest_code(data: CodeInput):
    features = extract_features(data.code)
    pred = clf.predict(features)
    return {"suggested_model": le.inverse_transform(pred)[0]}
