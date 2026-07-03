import api from './api'

export interface ReportItem {
  destination: string
  likesCount: number
}

async function getReport(): Promise<ReportItem[]> {
  const response = await api.get('/report')
  return response.data
}

function downloadCsv(): void {
  // Open as a direct browser download — the backend sets Content-Disposition: attachment
  window.open('/api/report/csv', '_blank')
}

const reportService = { getReport, downloadCsv }
export default reportService
