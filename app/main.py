from fastapi import FastAPI
from pydantic import BaseModel
from app.model_loader import predict_sentiment
from app.logger import logger



app = FastAPI()

class TextRequest(BaseModel):
    text: str



@app.get("/")
def home():
    return {"message": "Welcome to the Text Sentiment Predictor API!"}

@app.post("/predict")
def predict(request: TextRequest):
    try:
        sentiment = predict_sentiment(request.text)
        logger.info(f"Input: {request.text} | Predicted Sentiment: {sentiment}")
        return {"sentiment":sentiment}
    except Exception as e:
        logger.error(f"Error processing input: {request.text} | Error: {str(e)}")
        return {"error": "An error occurred while processing the request."}
    
    