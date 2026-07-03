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

async function getOne(id: string): Promise<VacationModel> {
  const response = await api.get(`/vacations/${id}`)
  return response.data
}

async function add(formData: FormData): Promise<VacationModel> {
  const response = await api.post('/vacations', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

async function update(id: string, formData: FormData): Promise<VacationModel> {
  const response = await api.put(`/vacations/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

async function remove(id: string): Promise<void> {
  await api.delete(`/vacations/${id}`)
}

const vacationService = { getAll, like, unlike, getOne, add, update, remove }
export default vacationService

