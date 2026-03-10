# 🧠 Text Sentiment Predictor

**A full-stack AI-powered web application that analyzes the sentiment of any English text in real time.**

Built with FastAPI, React, HuggingFace Transformers, Docker, and deployed on AWS EC2 with a fully automated CI/CD pipeline using GitHub Actions.

![Python](https://img.shields.io/badge/Python-3.10-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.135-009688?logo=fastapi)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Docker](https://img.shields.io/badge/Docker-Multi--Stage-2496ED?logo=docker)
![AWS](https://img.shields.io/badge/AWS-EC2-FF9900?logo=amazonaws)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?logo=githubactions)

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [System Architecture](#-system-architecture)
- [The AI Model](#-the-ai-model)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Backend — FastAPI](#-backend--fastapi)
- [Frontend — React + Vite](#-frontend--react--vite)
- [Data Pipeline](#-data-pipeline)
- [Containerization — Docker](#-containerization--docker)
- [CI/CD Pipeline — GitHub Actions](#-cicd-pipeline--github-actions)
- [AWS Deployment](#-aws-deployment)
- [How It All Connects](#-how-it-all-connects)
- [Local Development](#-local-development)
- [Key Concepts & Technologies](#-key-concepts--technologies)
- [What I Learned](#-what-i-learned)

---

## 🔍 Overview

This project is an **end-to-end MLOps system** — from data preprocessing to model serving to cloud deployment with continuous delivery. A user types any English text into a clean web interface, and the system returns whether the sentiment is **POSITIVE** or **NEGATIVE**, along with a confidence score.

**What makes this project complete:**
- Real AI model inference (not a mock)
- Production-grade API with validation and logging
- Modern frontend with a polished UI
- Dockerized multi-stage build
- Automated build & deploy pipeline
- Cloud-hosted on AWS

---

## 🌐 Live Demo

> **Frontend + API**: `http://<your-ec2-ip>:8000`
>
> **API Docs (Swagger)**: `http://<your-ec2-ip>:8000/docs`
>
> **API Endpoint**: `POST http://<your-ec2-ip>:8000/predict`

```json
// Request
{ "text": "I absolutely love this product!" }

// Response
{
  "sentiment": {
    "label": "POSITIVE",
    "confidence": 0.9998,
    "model": "distilbert-base-uncased-finetuned-sst-2-english"
  }
}
```

---

## 🏗 System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                            │
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐   │
│   │              React Frontend (Vite)                       │   │
│   │   Text Input → Analyze Button → Sentiment Result         │   │
│   └────────────────────────┬─────────────────────────────────┘   │
│                            │ POST /predict                       │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                    AWS EC2 (t3.micro)                             │
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐   │
│   │                Docker Container                          │   │
│   │                                                          │   │
│   │   ┌──────────────────────────────────────────────────┐   │   │
│   │   │            FastAPI Application                   │   │   │
│   │   │                                                  │   │   │
│   │   │  GET  /*        → Serve React (index.html)       │   │   │
│   │   │  POST /predict  → Run Model Inference            │   │   │
│   │   │  GET  /docs     → Swagger UI                     │   │   │
│   │   │                                                  │   │   │
│   │   │  ┌────────────────────────────────────────────┐  │   │   │
│   │   │  │  HuggingFace Transformers                  │  │   │   │
│   │   │  │  DistilBERT (SST-2 Fine-tuned)            │  │   │   │
│   │   │  │  PyTorch Runtime (CPU)                     │  │   │   │
│   │   │  └────────────────────────────────────────────┘  │   │   │
│   │   └──────────────────────────────────────────────────┘   │   │
│   └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
                             ▲
                             │ docker pull
                             │
┌──────────────────────────────────────────────────────────────────┐
│              GitHub Container Registry (ghcr.io)                 │
│              Pre-built Docker Image (~1GB)                        │
└────────────────────────────┬─────────────────────────────────────┘
                             ▲
                             │ docker push
                             │
┌──────────────────────────────────────────────────────────────────┐
│                    GitHub Actions CI/CD                           │
│                                                                  │
│   push to main → Build Docker Image → Push to GHCR → Deploy     │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🤖 The AI Model

| Property | Detail |
|---|---|
| **Model** | `distilbert-base-uncased-finetuned-sst-2-english` |
| **Source** | [HuggingFace Model Hub](https://huggingface.co/distilbert-base-uncased-finetuned-sst-2-english) |
| **Architecture** | DistilBERT — a distilled (compressed) version of Google's BERT |
| **Parameters** | 66 million |
| **Training Data** | Stanford Sentiment Treebank v2 (SST-2) — 67K movie review sentences |
| **Task** | Binary sentiment classification (POSITIVE / NEGATIVE) |
| **Framework** | PyTorch (CPU-only build for lightweight deployment) |
| **Loading** | HuggingFace `pipeline("sentiment-analysis")` — auto-downloads on first run |

**Why DistilBERT?**
- 40% smaller than BERT, 60% faster — perfect for a t3.micro EC2 instance
- Retains 97% of BERT's accuracy on SST-2
- Pre-trained + fine-tuned = zero training needed, instant results

**Model Warmup**: On startup, the model runs a dummy prediction (`"hello world"`) to pre-load all weights into memory, ensuring the first real request is fast.

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **AI/ML** | HuggingFace Transformers, PyTorch | Sentiment analysis model |
| **Backend** | FastAPI, Uvicorn, Pydantic | REST API, validation, ASGI server |
| **Frontend** | React 19, Vite 8 | User interface |
| **Containerization** | Docker (multi-stage) | Packaging & isolation |
| **CI/CD** | GitHub Actions | Automated build & deploy |
| **Registry** | GitHub Container Registry (ghcr.io) | Docker image hosting |
| **Cloud** | AWS EC2 (t3.micro) | Production hosting |
| **Networking** | AWS Security Groups | Firewall / inbound rules |
| **Data** | Pandas, scikit-learn, Jupyter | Preprocessing & experimentation |
| **Logging** | Python `logging` module | Request & error tracking |
| **Version Control** | Git, GitHub | Source code management |

---

## 📁 Project Structure

```
Text-Sentiment-Predictor-AWS/
│
├── app/                            # 🔧 Backend API
│   ├── main.py                     #    FastAPI app, routes, static file serving
│   ├── schemas.py                  #    Pydantic request/response models
│   ├── model_loader.py             #    HuggingFace model loading + warmup
│   ├── inference.py                #    Prediction logic
│   └── logger.py                   #    File-based logging setup
│
├── frontend/                       # 🎨 React Frontend
│   ├── src/
│   │   ├── App.jsx                 #    Main component (form, results, API calls)
│   │   ├── App.css                 #    Component styling
│   │   ├── index.css               #    Global styles
│   │   └── main.jsx                #    React entry point
│   ├── index.html                  #    HTML shell
│   ├── vite.config.js              #    Vite config + dev proxy
│   └── package.json                #    Node dependencies
│
├── model/                          # 🧪 Experimental sklearn model
│   └── train.py                    #    TF-IDF + Logistic Regression trainer
│
├── data/                           # 📊 Datasets
│   ├── twitter_sentiment.csv       #    Raw Twitter sentiment data
│   └── preprocessed_twitter_sentiment.csv  #  Cleaned data
│
├── notebooks/                      # 📓 Jupyter Notebooks
│   └── preprocess.ipynb            #    Data cleaning & exploration
│
├── logs/                           # 📝 Runtime logs
├── tests/                          # 🧪 Test directory
│
├── .github/workflows/
│   └── deploy.yml                  #    CI/CD pipeline definition
│
├── Dockerfile                      #    Multi-stage Docker build
├── requirements.txt                #    Python dependencies
├── .gitignore                      #    Git exclusions
└── README.md                       #    You are here
```

---

## ⚙️ Backend — FastAPI

The backend is a **FastAPI** application that serves both the REST API and the React frontend from a single process.

### API Endpoints

| Method | Route | Description |
|---|---|---|
| `POST` | `/predict` | Accepts `{"text": "..."}`, returns sentiment analysis |
| `GET` | `/docs` | Auto-generated Swagger documentation |
| `GET` | `/*` | Serves the React frontend (SPA catch-all) |

### Request Validation

Uses **Pydantic** to validate incoming requests:

```python
class TextRequest(BaseModel):
    text: str
```

Invalid requests are automatically rejected with clear error messages.

### Inference Pipeline

```
User text → HuggingFace pipeline → DistilBERT → {label, confidence, model}
```

The model is loaded **once** at startup and reused for every request — no cold starts after the initial load.

### Logging

Every prediction is logged to `logs/app.log`:
```
2026-03-11 - INFO - Input: I love this! | Predicted Sentiment: POSITIVE | Confidence: 0.9998 | Model: distilbert-...
```

### CORS

Cross-Origin Resource Sharing is enabled to allow the frontend to communicate with the API during development.

### Static File Serving

In production, FastAPI serves the built React app directly:
- `/assets/*` — static JS/CSS files
- All other GET routes — `index.html` (SPA routing)

This means **everything runs on one port (8000)** — no Nginx, no reverse proxy needed.

---

## 🎨 Frontend — React + Vite

A modern, dark-themed single-page application built with **React 19** and **Vite 8**.

### Features

- **Text input** with placeholder guidance
- **Analyze button** with loading spinner
- **Sentiment badge** — color-coded (green = positive, red = negative) with emoji
- **Confidence bar** — animated progress bar showing model certainty
- **Model info** — displays which model made the prediction
- **Error handling** — graceful messages when API is unreachable

### Development Proxy

In development mode, Vite proxies `/predict` requests to the backend server, avoiding CORS issues:

```js
// vite.config.js
server: {
  proxy: {
    '/predict': 'http://18.188.154.186:8000',
  },
}
```

### Production Build

`npm run build` generates static files in `frontend/dist/` which FastAPI serves directly. The `API_URL` defaults to `''` (same origin), so no configuration needed.

---

## 📊 Data Pipeline

### Dataset

- **Source**: Twitter sentiment dataset
- **Raw file**: `data/twitter_sentiment.csv`
- **Preprocessed**: `data/preprocessed_twitter_sentiment.csv`

### Preprocessing (Jupyter Notebook)

`notebooks/preprocess.ipynb` handles:
- Text cleaning (removing URLs, mentions, special characters)
- Tokenization and normalization
- Exporting clean data for model training

### Experimental Model

`model/train.py` trains a simpler **Logistic Regression** classifier:
- **Vectorizer**: TF-IDF (Term Frequency–Inverse Document Frequency)
- **Algorithm**: Logistic Regression (200K max iterations)
- **Purpose**: Baseline comparison / experimentation

The production system uses the more powerful **DistilBERT** model instead.

---

## 🐳 Containerization — Docker

### Multi-Stage Build

The Dockerfile uses a **two-stage build** to keep the final image efficient:

```dockerfile
# Stage 1: Build React frontend
FROM node:22-slim AS frontend-build
# npm ci → npm run build → produces dist/

# Stage 2: Python API + built frontend
FROM python:3.10-slim
# pip install → copy app → copy dist/ from Stage 1
# CMD: uvicorn on port 8000
```

**Why multi-stage?**
- Node.js is only needed to build the frontend — it's not in the final image
- Final image contains only Python, the app code, and pre-built static files
- Smaller image = faster pulls on EC2

### Key Docker Concepts Used

| Concept | Purpose |
|---|---|
| Multi-stage builds | Separate build and runtime environments |
| Layer caching | Faster rebuilds (dependencies cached separately) |
| `.dockerignore` | Exclude `node_modules`, `venv`, `__pycache__` from context |
| `EXPOSE 8000` | Document the container's listening port |
| CPU-only PyTorch | `--extra-index-url` for smaller torch without CUDA |

---

## 🔄 CI/CD Pipeline — GitHub Actions

### Workflow: `deploy.yml`

Triggered automatically on every **push to `main`**:

```
git push origin main
        │
        ▼
┌──────────────────────────────┐
│  JOB 1: BUILD                │
│  (GitHub Actions runner)     │
│                              │
│  1. Checkout code            │
│  2. Lowercase image tag      │
│  3. Login to ghcr.io         │
│  4. Docker build (multi-     │
│     stage: Node + Python)    │
│  5. Push image to GHCR       │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  JOB 2: DEPLOY               │
│  (SSH into EC2)              │
│                              │
│  1. docker pull <image>      │
│  2. Stop old containers      │
│  3. Remove old containers    │
│  4. docker run (port 8000)   │
└──────────────┬───────────────┘
               │
               ▼
        🟢 APP IS LIVE
```

### Why Build on GitHub, Not EC2?

The EC2 instance is a **t3.micro** (1 vCPU, 1GB RAM). Building Node + PyTorch requires significantly more memory. GitHub Actions runners have **16GB RAM** — perfect for heavy builds. EC2 only needs to **pull and run** the pre-built ~1GB image.

### GitHub Container Registry (ghcr.io)

- Free for public repositories
- Uses the built-in `GITHUB_TOKEN` — no extra credentials
- Image tag: `ghcr.io/<owner>/<repo>:latest`
- Image names must be lowercase (handled by the `tr` command in the workflow)

### Secrets Used

| Secret | Purpose |
|---|---|
| `EC2_HOST` | EC2 instance public IP address |
| `EC2_USER` | SSH username (`ubuntu`) |
| `EC2_SSH_KEY` | Private key for SSH authentication |
| `GITHUB_TOKEN` | Auto-provided by GitHub — pushes images to ghcr.io |

---

## ☁️ AWS Deployment

### EC2 Instance

| Property | Value |
|---|---|
| **Instance Type** | t3.micro (1 vCPU, 1 GiB RAM) |
| **OS** | Ubuntu (Linux) |
| **Region** | us-east-2 (Ohio) |
| **Software** | Docker |

### Security Groups (Firewall)

| Rule | Port | Purpose |
|---|---|---|
| SSH | 22 | GitHub Actions deployment (SSH access) |
| HTTP | 80 | Standard web traffic |
| HTTPS | 443 | Secure web traffic |
| Custom TCP | 8000 | Application port (FastAPI + React) |

### Elastic IP (Recommended)

AWS assigns dynamic public IPs by default — they change on instance stop/start. An **Elastic IP** provides a static address that persists, preventing CI/CD failures when the IP changes.

### What Runs on EC2

```
EC2 Instance
└── Docker
    └── sentiment-api container
        ├── Uvicorn (ASGI server)
        ├── FastAPI (API + static serving)
        ├── DistilBERT model (in memory)
        └── React frontend (static files)
```

Everything runs in a **single container on port 8000** — minimal infrastructure, maximum simplicity.

---

## 🔗 How It All Connects

### Full Request Flow

```
1. User visits http://<ec2-ip>:8000
2. FastAPI serves React's index.html + JS/CSS
3. Browser renders the sentiment analysis UI
4. User types: "This movie was absolutely fantastic!"
5. User clicks "Analyze Sentiment"
6. React sends: POST /predict {"text": "This movie was absolutely fantastic!"}
7. FastAPI validates the request via Pydantic
8. inference.py passes text to the HuggingFace pipeline
9. DistilBERT tokenizes → encodes → classifies the text
10. Model returns: {label: "POSITIVE", score: 0.9998}
11. Logger writes the prediction to logs/app.log
12. FastAPI responds: {"sentiment": {label, confidence, model}}
13. React displays: green "POSITIVE" badge + 99.9% confidence bar
```

### Full Deployment Flow

```
1. Developer pushes code to GitHub (main branch)
2. GitHub Actions triggers deploy.yml
3. GitHub runner builds Docker image (Node → React build, Python → API)
4. Image is pushed to GitHub Container Registry
5. GitHub Actions SSHs into EC2
6. EC2 pulls the new image from ghcr.io
7. Old container is stopped and removed
8. New container starts on port 8000
9. App is live — zero downtime deployment
```

---

## 💻 Local Development

### Prerequisites

- Python 3.10+
- Node.js 22+
- Git

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/Mirza-Abdul-Wasay5704/Text-Sentiment-Predictor-AWS.git
cd Text-Sentiment-Predictor-AWS

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# .\venv\Scripts\Activate.ps1  # Windows PowerShell

# Install dependencies
pip install -r requirements.txt

# Start the API
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` — the Vite dev server proxies API requests to the backend.

### Docker (Full Stack)

```bash
docker build -t sentiment-api .
docker run -p 8000:8000 sentiment-api
```

Visit `http://localhost:8000` — both frontend and API served together.

---

## 📚 Key Concepts & Technologies

| Concept | Where It's Used |
|---|---|
| **Transfer Learning** | Using a pre-trained DistilBERT model fine-tuned on SST-2 |
| **Model Distillation** | DistilBERT is a distilled version of BERT (smaller, faster, retains accuracy) |
| **Transformer Architecture** | Self-attention mechanism for understanding text context |
| **Tokenization** | Converting text to numerical tokens the model understands |
| **REST API Design** | FastAPI with proper HTTP methods, status codes, JSON I/O |
| **Request Validation** | Pydantic models for automatic input validation |
| **ASGI Server** | Uvicorn — async server for FastAPI |
| **SPA (Single Page App)** | React frontend with client-side routing |
| **Dev Proxy** | Vite proxying API calls to avoid CORS in development |
| **Multi-Stage Docker Build** | Separate build and runtime stages for smaller images |
| **Container Registry** | GitHub Container Registry for storing Docker images |
| **CI/CD** | Automated pipeline from code push to live deployment |
| **SSH Remote Execution** | GitHub Actions SSHing into EC2 to deploy |
| **Infrastructure as Code** | Deployment defined in YAML (deploy.yml) |
| **TF-IDF** | Text vectorization technique (used in experimental model) |
| **Logistic Regression** | Classical ML classifier (baseline model) |
| **Cloud Computing** | AWS EC2 for always-on hosting |
| **Security Groups** | AWS virtual firewall controlling network access |
| **Elastic IP** | Static IP address for consistent access |
| **Environment Variables** | `VITE_API_URL` for configurable API endpoint |

---

## 🎓 What I Learned

- How to take an ML model from a notebook to a production API
- Building a full-stack app with FastAPI serving both API and frontend
- Multi-stage Docker builds for efficient containerization
- Setting up CI/CD that builds on powerful GitHub runners and deploys to a lightweight EC2 instance
- Working with AWS EC2, security groups, and networking
- Debugging real deployment issues: Docker permissions, port conflicts, CORS, IP changes, SSH timeouts, image tag casing
- The value of keeping infrastructure simple — one container, one port, one command to deploy

---

## 📄 License

This project is licensed under the terms of the [LICENSE](LICENSE) file.

---

<p align="center">
  Built with ❤️ by <strong>Abdul Wasay</strong>
</p>
