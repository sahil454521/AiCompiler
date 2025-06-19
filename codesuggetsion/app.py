import streamlit as st
import re
import pandas as pd
import joblib

# Load model & label encoder
clf = joblib.load("model_suggestion_classifier.pkl")
le = joblib.load("label_encoder.pkl")

# Feature extractor
def extract_features(snippet):
    lines = snippet.strip().split('\n')
    num_lines = len(lines)
    num_chars = len(snippet)
    avg_line_length = sum(len(line) for line in lines) / num_lines if num_lines > 0 else 0

    num_keywords = len(re.findall(r"\b(def|class|fit|transform|predict|compile|train|model)\b", snippet))
    num_functions = snippet.count("def")
    num_classes = snippet.count("class")

    uses_linear_regression = "LinearRegression" in snippet
    uses_xgboost = "xgboost" in snippet
    uses_tensorflow = "tensorflow" in snippet
    uses_keras = "keras" in snippet
    uses_torch = "torch" in snippet
    uses_sklearn = "sklearn" in snippet
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

# Streamlit UI
st.set_page_config(page_title="ML Model Suggestion Assistant")
st.title("🤖 ML Model Suggester for Code Snippets")

code_input = st.text_area("Paste your Python code snippet here:")

if st.button("Suggest Model"):
    if not code_input.strip():
        st.warning("Please paste a code snippet.")
    else:
        X = extract_features(code_input)
        pred = clf.predict(X)
        suggestion = le.inverse_transform(pred)[0]

        st.subheader("🔮 Suggested ML Model / Library:")
        st.success(suggestion)

        with st.expander("📊 Extracted Features"):
            st.dataframe(X)
