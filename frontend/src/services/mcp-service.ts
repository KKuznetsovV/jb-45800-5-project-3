import api from './api'

async function ask(question: string): Promise<{ answer: string }> {
  const response = await api.post('/mcp/ask', { question })
  return response.data
}

const mcpService = { ask }
export default mcpService
