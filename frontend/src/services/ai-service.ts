import api from './api'

async function recommend(destination: string): Promise<{ recommendation: string }> {
  const response = await api.post('/ai/recommend', { destination })
  return response.data
}

const aiService = { recommend }
export default aiService
