import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from pathlib import Path

# # load dataset
# data = pd.read_csv("data/preprocessed_twitter_sentiment.csv")


candidate_paths = [
	Path("data/preprocessed_twitter_sentiment.csv"),
	Path("../data/preprocessed_twitter_sentiment.csv")
]

csv_path = next((p for p in candidate_paths if p.exists()), None)

if csv_path is None:
	print("Dataset not found. Checked:")
	for p in candidate_paths:
		print(f"- {p.resolve()}")
	data = pd.DataFrame()
else:
	data = pd.read_csv(csv_path)
	print(f"Data loaded successfully from: {csv_path.resolve()}\n\n")



X = data["clean_text"]
y = data["category"]

# convert text → numbers
vectorizer = TfidfVectorizer()

X_vectorized = vectorizer.fit_transform(X)

# train model
model = LogisticRegression(max_iter=200000)

model.fit(X_vectorized, y)

# save artifacts
joblib.dump(model, "model/model.pkl")
joblib.dump(vectorizer, "model/vectorizer.pkl")

print("Model training complete!")