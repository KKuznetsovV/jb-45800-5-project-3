import api from './api'
import VacationModel from '../models/VacationModel'

export interface VacationsResponse {
  vacations: VacationModel[]
  total: number
  page: number
  pages: number
}

async function getAll(page = 1, filter = ''): Promise<VacationsResponse> {
  const params: Record<string, unknown> = { page }
  if (filter) params.filter = filter
  const response = await api.get('/vacations', { params })
  return response.data
}

async function like(vacationId: string): Promise<{ likesCount: number }> {
  const response = await api.post(`/likes/${vacationId}`)
  return response.data
}

async function unlike(vacationId: string): Promise<{ likesCount: number }> {
  const response = await api.delete(`/likes/${vacationId}`)
  return response.data
}

const vacationService = { getAll, like, unlike }
export default vacationService

