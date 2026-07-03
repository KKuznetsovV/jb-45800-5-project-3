import { FormEvent, useState } from 'react'
import aiService from '../../services/ai-service'
import './AiRecommend.css'

function AiRecommend() {
  const [destination, setDestination]     = useState('')
  const [recommendation, setRecommendation] = useState('')
  const [loading, setLoading]             = useState(false)
  const [error, setError]                 = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!destination.trim()) return
    setLoading(true)
    setError('')
    setRecommendation('')
    try {
      const data = await aiService.recommend(destination)
      setRecommendation(data.recommendation)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ai-page">
      <div className="ai-container">
        <h2>✈️ AI Travel Recommendation</h2>
        <p className="ai-subtitle">
          Enter a destination and get a personalized travel recommendation powered by AI.
        </p>

        <form onSubmit={handleSubmit} className="ai-form">
          <input
            type="text"
            placeholder="e.g. Tokyo, Paris, Bali..."
            value={destination}
            onChange={e => setDestination(e.target.value)}
            required
            className="ai-input"
          />
          <button type="submit" className="ai-btn" disabled={loading}>
            {loading ? 'Thinking…' : 'Get Recommendation'}
          </button>
        </form>

        {error && <p className="ai-error">{error}</p>}

        {recommendation && (
          <div className="ai-result">
            <h3>🌍 {destination}</h3>
            <p>{recommendation}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AiRecommend
