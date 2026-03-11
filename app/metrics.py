from prometheus_client import Counter, Histogram

# Counter: sirf upar jaata hai (1, 2, 3...) — count karne ke liye
# label='POSITIVE' ya 'NEGATIVE' se alag alag count hoga
PREDICTION_COUNT = Counter(
    'prediction_total',
    'Total number of predictions made',
    ['label']
)

# Histogram: values ko buckets mein daalta hai — time measure karne ke liye
# buckets define karte hain ke kaunsi ranges track karni hain
PREDICTION_LATENCY = Histogram(
    'prediction_latency_seconds',
    'Time taken for each prediction',
    buckets=[0.1, 0.25, 0.5, 0.75, 1.0, 2.0, 5.0]
)

# Histogram: confidence scores track karne ke liye
# buckets 0.5 se 0.99 tak — low confidence predictions alert ke liye
PREDICTION_CONFIDENCE = Histogram(
    'prediction_confidence',
    'Confidence scores of predictions',
    buckets=[0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 0.95, 0.99]
)

# Counter: errors count — agar yeh badh raha hai toh problem hai
PREDICTION_ERRORS = Counter(
    'prediction_errors_total',
    'Total number of failed predictions'
)