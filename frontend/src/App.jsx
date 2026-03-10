import { useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || ''

function App() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() }),
      })

      if (!response.ok) throw new Error('Request failed')

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setResult(data.sentiment)
      }
    } catch {
      setError('Failed to connect to the API. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const getSentimentColor = (label) => {
    if (!label) return '#6b7280'
    return label === 'POSITIVE' ? '#10b981' : '#ef4444'
  }

  const getSentimentEmoji = (label) => {
    if (!label) return ''
    return label === 'POSITIVE' ? '\u{1F60A}' : '\u{1F61E}'
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>Text Sentiment Predictor</h1>
          <p className="subtitle">
            Analyze the sentiment of any text using AI
          </p>
        </header>

        <form onSubmit={handleSubmit} className="form">
          <textarea
            className="textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here... e.g. 'I love this product, it works great!'"
            rows={5}
          />
          <button
            type="submit"
            className="button"
            disabled={loading || !text.trim()}
          >
            {loading ? (
              <span className="loading-text">
                <span className="spinner" />
                Analyzing...
              </span>
            ) : (
              'Analyze Sentiment'
            )}
          </button>
        </form>

        {error && (
          <div className="error-card">
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="result-card">
            <div
              className="sentiment-badge"
              style={{ backgroundColor: getSentimentColor(result.label) }}
            >
              <span className="emoji">{getSentimentEmoji(result.label)}</span>
              <span className="label">{result.label}</span>
            </div>

            <div className="details">
              <div className="detail-row">
                <span className="detail-label">Confidence</span>
                <div className="confidence-bar-bg">
                  <div
                    className="confidence-bar"
                    style={{
                      width: `${(result.confidence * 100).toFixed(1)}%`,
                      backgroundColor: getSentimentColor(result.label),
                    }}
                  />
                </div>
                <span className="detail-value">
                  {(result.confidence * 100).toFixed(1)}%
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Model</span>
                <span className="detail-value model-name">{result.model}</span>
              </div>
            </div>
          </div>
        )}

        <footer className="footer">
          <p>
            Powered by <strong>FastAPI</strong> &amp;{' '}
            <strong>HuggingFace Transformers</strong>
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
