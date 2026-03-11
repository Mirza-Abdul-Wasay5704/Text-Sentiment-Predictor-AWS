import time
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, Response
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
from app.schemas import TextRequest
from app.inference import predict_sentiment
from app.model_loader import load_model
from app.logger import logger
from app.metrics import (
    PREDICTION_COUNT,
    PREDICTION_LATENCY,
    PREDICTION_CONFIDENCE,
    PREDICTION_ERRORS,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend" / "dist"


@app.on_event("startup")
def startup_event():
    load_model()


# Prometheus metrics endpoint — explicit route so it doesn't get caught by catch-all
@app.get("/metrics")
def metrics():
    return Response(content=generate_latest(), media_type=CONTENT_TYPE_LATEST)


@app.post("/predict")
def predict(request: TextRequest):

    try:
        start_time = time.time()

        sentiment = predict_sentiment(request.text)

        latency = time.time() - start_time

        PREDICTION_COUNT.labels(label=sentiment['label']).inc()
        PREDICTION_LATENCY.observe(latency)
        PREDICTION_CONFIDENCE.observe(sentiment['confidence'])

        logger.info(
            f"Input: {request.text} | "
            f"Predicted Sentiment: {sentiment['label']} | "
            f"Confidence: {sentiment['confidence']} | "
            f"Latency: {latency:.4f}s | "
            f"Model: {sentiment['model']}"
        )

        return {"sentiment": sentiment}

    except Exception as e:

        PREDICTION_ERRORS.inc()

        logger.error(f"Error processing input: {request.text} | Error: {str(e)}")

        return {"error": "An error occurred while processing the request."}


# Serve React frontend (must be after API routes)
if FRONTEND_DIR.exists():
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIR / "assets"), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        return FileResponse(FRONTEND_DIR / "index.html")