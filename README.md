# 🧠 AiCompiler — Your AI-Powered Code Suggestion IDE

> An intelligent, VS Code–style online code editor that suggests machine learning code snippets in real-time using a custom-trained ML model.

---

## 🚀 Live Demo

**Frontend**: [https://your-ai-compiler.vercel.app](https://your-ai-compiler.vercel.app)  
**ML API (FastAPI)**: [https://ml-code-suggestion-api.onrender.com/docs](https://ml-code-suggestion-api.onrender.com/docs)

---

## 🛠 Tech Stack

| Layer | Tech Used |
|-------|-----------|
| ✨ Frontend | React (Next.js), Monaco Editor, Framer Motion |
| 🧠 Backend API | Node.js |
| 🧪 Machine Learning API | FastAPI, scikit-learn, Render |
| 🔐 Auth | Clerk |
| 📦 DB | Convex |
| ☁️ Deployment | Vercel (frontend), Render (ML API) |

---

## 🧠 What It Does

- Live Monaco editor with syntax highlighting
- Real-time code analysis via a FastAPI ML model
- Predicts the most likely ML framework/library (e.g. `LinearRegression`, `XGBoost`)
- Returns a relevant code snippet (e.g. `.fit(X, y)`) as **inline ghost text**
- Supports `Tab` to auto-insert suggestions like VS Code

---

## 🎯 Current Capabilities

✅ Suggests ML code in Python for:

- Scikit-learn (Linear Regression, Random Forest, etc.)
- TensorFlow / Keras
- PyTorch
- XGBoost

⚠️ **Currently limited to single-line code suggestions for Python ML use cases.**

---

## 🔮 Coming Soon

- Multi-line completions with full context
- Support for JavaScript, C++, TypeScript, etc.
- Auto `pip install` prompts
- Fine-tuned code suggestion based on user style

---

## 📁 Project Structure

/ ├── frontend/                 # React + Monaco Editor ├── pages/api/suggest.ts     # Node.js API route to ML model ├── utils/                   # Editor state/store logic ├── code_suggestion_api/     # FastAPI ML microservice (deployed on Render) │   ├── main.py │   ├── model_suggestion_classifier.pkl │   ├── label_encoder.pkl │   └── requirements.txt

---

## 📦 Setup Instructions

### 1. ML Suggestion API (Python)

```bash
cd code_suggestion_api
pip install -r requirements.txt
uvicorn main:app --reload

API will run on http://localhost:8000/suggest

2. Frontend (Next.js)

npm install
npm run dev

Then open http://localhost:3000


---

🤝 Contributing

Got ideas to improve suggestion logic or support more languages?
PRs and issues are welcome! Let's make this the future of intelligent coding.


---

📜 License

MIT License — feel free to fork, clone, and build upon this.


---

💬 Connect With Me

🔗 LinkedIn – https://www.linkedin.com/in/sahil-pathak21

📫 DM me to collaborate on dev tools, AI assistants, or research projects!

---

### ✅ Next Step

Let me know your:
- GitHub repo name or slug so I can update the links
- Any demo link if you'd like me to embed a screenshot/gif preview
