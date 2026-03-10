from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.schemas import TextRequest
from app.inference import predict_sentiment
from app.model_loader import load_model
from app.logger import logger

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


@app.post("/predict")
def predict(request: TextRequest):

    try:

        sentiment = predict_sentiment(request.text)

        logger.info(
            f"Input: {request.text} | "
            f"Predicted Sentiment: {sentiment['label']} | "
            f"Confidence: {sentiment['confidence']} | "
            f"Model: {sentiment['model']}"
        )

        return {"sentiment": sentiment}

    except Exception as e:

        logger.error(f"Error processing input: {request.text} | Error: {str(e)}")

        return {"error": "An error occurred while processing the request."}


# Serve React frontend (must be after API routes)
if FRONTEND_DIR.exists():
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIR / "assets"), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        return FileResponse(FRONTEND_DIR / "index.html")