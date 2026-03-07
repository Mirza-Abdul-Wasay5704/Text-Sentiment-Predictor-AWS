import joblib

# load model and vectorizer
model = joblib.load("model/model.pkl")
vectorizer = joblib.load("model/vectorizer.pkl")


def predict_sentiment(text: str):
    text_vector = vectorizer.transform([text])
    prediction = model.predict(text_vector)
    return prediction[0]


