from transformers import pipeline

sentiment_pipeline = None

def load_model():

    global sentiment_pipeline

    if sentiment_pipeline is None:                                          
        sentiment_pipeline = pipeline(
            "sentiment-analysis",
            model="distilbert-base-uncased-finetuned-sst-2-english"
        )

        # warmup
        sentiment_pipeline("hello world")