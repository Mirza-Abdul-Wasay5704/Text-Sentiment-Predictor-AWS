from app import model_loader

def predict_sentiment(text: str):

    result = model_loader.sentiment_pipeline(text)[0]

    return {
        "label": result["label"],
        "confidence": float(result["score"]),
        "model": "distilbert-base-uncased-finetuned-sst-2-english"
    }