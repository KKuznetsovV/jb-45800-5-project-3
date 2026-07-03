import api from './api'

export interface ReportItem {
  destination: string
  likesCount: number
}

async function getReport(): Promise<ReportItem[]> {
  const response = await api.get('/report')
  return response.data
}

async function downloadCsv(): Promise<void> {
  const response = await api.get('/report/csv', { responseType: 'blob' })
  const url = URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'Vacation Likes.csv'
  a.click()
  URL.revokeObjectURL(url)
}

const reportService = { getReport, downloadCsv }
export default reportService
