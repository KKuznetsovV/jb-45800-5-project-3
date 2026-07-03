import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import reportService, { ReportItem } from '../../services/report-service'
import './Report.css'

const BAR_COLOR = '#4f8ef7'

function Report() {
  const [data, setData]       = useState<ReportItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    reportService.getReport()
      .then(setData)
      .catch(() => setError('Failed to load report data.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="report-page">
      <div className="report-header">
        <h2>📊 Vacations Likes Report</h2>
        <button className="btn-csv" onClick={() => reportService.downloadCsv().catch(console.error)}>
          ⬇ Download CSV
        </button>
      </div>

      {loading && <p className="report-message">Loading report...</p>}
      {error   && <p className="report-message report-error">{error}</p>}

      {!loading && !error && (
        <div className="report-chart-wrap">
          <ResponsiveContainer width="100%" height={420}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 100 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="destination"
                angle={-40}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 13 }}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 13 }}
                label={{ value: 'Likes', angle: -90, position: 'insideLeft', offset: 10 }}
              />
              <Tooltip
                formatter={(value: number) => [value, 'Likes']}
                cursor={{ fill: 'rgba(79,142,247,0.08)' }}
              />
              <Bar dataKey="likesCount" radius={[6, 6, 0, 0]}>
                {data.map((_, i) => (
                  <Cell key={i} fill={BAR_COLOR} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default Report
