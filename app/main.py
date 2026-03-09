from fastapi import FastAPI
from app.schemas import TextRequest
from app.inference import predict_sentiment
from app.model_loader import load_model
from app.logger import logger

app = FastAPI()


@app.on_event("startup")
def startup_event():
    load_model()


@app.get("/")
def home():
    return {"message": "Welcome to the Text Sentiment Predictor API!"}


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