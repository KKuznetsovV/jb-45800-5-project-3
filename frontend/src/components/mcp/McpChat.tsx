import { FormEvent, useRef, useState } from 'react'
import mcpService from '../../services/mcp-service'
import './McpChat.css'

interface Message {
  question: string
  answer: string
}

function McpChat() {
  const [question, setQuestion]   = useState('')
  const [messages, setMessages]   = useState<Message[]>([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const q = question.trim()
    if (!q) return
    setQuestion('')
    setLoading(true)
    setError('')
    try {
      const data = await mcpService.ask(q)
      setMessages(prev => [...prev, { question: q, answer: data.answer }])
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mcp-page">
      <div className="mcp-container">
        <h2>🤖 Ask About Vacations</h2>
        <p className="mcp-subtitle">
          Ask anything about our available vacations. Powered by AI and real vacation data.
        </p>

        <div className="mcp-chat">
          {messages.length === 0 && !loading && (
            <p className="mcp-empty">Ask a question to get started…</p>
          )}

          {messages.map((msg, i) => (
            <div key={i} className="mcp-exchange">
              <div className="mcp-bubble mcp-bubble-question">
                <span className="mcp-label">You</span>
                <p>{msg.question}</p>
              </div>
              <div className="mcp-bubble mcp-bubble-answer">
                <span className="mcp-label">AI</span>
                <p>{msg.answer}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="mcp-bubble mcp-bubble-answer mcp-loading">
              <span className="mcp-label">AI</span>
              <p>Thinking…</p>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {error && <p className="mcp-error">{error}</p>}

        <form onSubmit={handleSubmit} className="mcp-form">
          <input
            type="text"
            placeholder="e.g. Which vacations are in the Caribbean?"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            disabled={loading}
            className="mcp-input"
          />
          <button type="submit" className="mcp-btn" disabled={loading || !question.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

export default McpChat
