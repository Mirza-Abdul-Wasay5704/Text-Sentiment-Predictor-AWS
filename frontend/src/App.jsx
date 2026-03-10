import { useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || ''

function App() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])

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
        setHistory((prev) => [
          { text: text.trim(), ...data.sentiment },
          ...prev.slice(0, 4),
        ])
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

  const handleClear = () => {
    setText('')
    setResult(null)
    setError(null)
  }

  return (
    <div className="app">
      {/* Background decorations */}
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />

      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="logo-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
          </div>
          <h1>Text Sentiment Predictor</h1>
          <p className="subtitle">
            Analyze the emotional tone of any text with AI-powered NLP
          </p>
          <div className="tech-pills">
            <span className="pill">DistilBERT</span>
            <span className="pill">FastAPI</span>
            <span className="pill">React</span>
            <span className="pill">AWS</span>
          </div>
        </header>

        {/* Main Card */}
        <div className="main-card">
          <form onSubmit={handleSubmit} className="form">
            <div className="textarea-wrapper">
              <textarea
                className="textarea"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste any text to analyze its sentiment..."
                rows={5}
                maxLength={1000}
              />
              <span className="char-count">{text.length}/1000</span>
            </div>
            <div className="button-group">
              <button
                type="submit"
                className="button button-primary"
                disabled={loading || !text.trim()}
              >
                {loading ? (
                  <span className="loading-text">
                    <span className="spinner" />
                    Analyzing...
                  </span>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                    Analyze Sentiment
                  </>
                )}
              </button>
              {text && (
                <button
                  type="button"
                  className="button button-ghost"
                  onClick={handleClear}
                >
                  Clear
                </button>
              )}
            </div>
          </form>

          {/* Error */}
          {error && (
            <div className="error-card">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <p>{error}</p>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="result-card">
              <div className="result-header">
                <div
                  className="sentiment-badge"
                  style={{
                    backgroundColor: `${getSentimentColor(result.label)}18`,
                    borderColor: `${getSentimentColor(result.label)}40`,
                    color: getSentimentColor(result.label),
                  }}
                >
                  <span className="sentiment-dot" style={{ backgroundColor: getSentimentColor(result.label) }} />
                  {result.label}
                </div>
                <span className="confidence-value" style={{ color: getSentimentColor(result.label) }}>
                  {(result.confidence * 100).toFixed(1)}%
                </span>
              </div>

              <div className="confidence-section">
                <div className="confidence-labels">
                  <span>Confidence</span>
                  <span>{(result.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="confidence-bar-bg">
                  <div
                    className="confidence-bar"
                    style={{
                      width: `${(result.confidence * 100).toFixed(1)}%`,
                      backgroundColor: getSentimentColor(result.label),
                    }}
                  />
                </div>
              </div>

              <div className="model-info">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>{result.model}</span>
              </div>
            </div>
          )}
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="history-section">
            <h3 className="history-title">Recent Analyses</h3>
            <div className="history-list">
              {history.map((item, i) => (
                <div key={i} className="history-item">
                  <span
                    className="history-dot"
                    style={{ backgroundColor: getSentimentColor(item.label) }}
                  />
                  <span className="history-text">
                    {item.text.length > 60 ? item.text.slice(0, 60) + '...' : item.text}
                  </span>
                  <span
                    className="history-label"
                    style={{ color: getSentimentColor(item.label) }}
                  >
                    {item.label}
                  </span>
                  <span className="history-confidence">
                    {(item.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="footer">
          <p className="footer-tech">
            Powered by <strong>FastAPI</strong>, <strong>HuggingFace Transformers</strong> &amp; <strong>AWS</strong>
          </p>
          <p className="footer-credit">
            Developed by{' '}
            <a href="https://github.com/Mirza-Abdul-Wasay5704" target="_blank" rel="noopener noreferrer">
              Mirza Abdul Wasay
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
