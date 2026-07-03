import { useEffect, useState } from 'react'
import VacationModel from '../../models/VacationModel'
import vacationService from '../../services/vacation-service'
import VacationCard from './VacationCard'
import './VacationList.css'

type Filter = '' | 'liked' | 'active' | 'upcoming'

function VacationList() {
  const [vacations, setVacations] = useState<VacationModel[]>([])
  const [page, setPage]   = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [filter, setFilter] = useState<Filter>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    vacationService.getAll(page, filter)
      .then(data => {
        setVacations(data.vacations)
        setPages(data.pages)
        setTotal(data.total)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [page, filter])

  function changeFilter(f: Filter) {
    setFilter(f)
    setPage(1)
  }

  async function handleLikeToggle(vacationId: string, isLiked: boolean) {
    try {
      const result = isLiked
        ? await vacationService.unlike(vacationId)
        : await vacationService.like(vacationId)

      setVacations(prev =>
        prev.map(v =>
          v._id === vacationId
            ? { ...v, isLiked: !isLiked, likesCount: result.likesCount }
            : v
        )
      )

      // Remove card from "liked" filter view when unliked
      if (filter === 'liked' && isLiked) {
        setVacations(prev => prev.filter(v => v._id !== vacationId))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const filters: { label: string; value: Filter }[] = [
    { label: 'All',      value: '' },
    { label: 'My Likes', value: 'liked' },
    { label: 'Active',   value: 'active' },
    { label: 'Upcoming', value: 'upcoming' },
  ]

  return (
    <div className="vacation-list-page">
      <div className="vacation-filters">
        {filters.map(f => (
          <button
            key={f.value}
            className={filter === f.value ? 'filter-btn active' : 'filter-btn'}
            onClick={() => changeFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && <p className="vacation-message">Loading vacations...</p>}
      {!loading && vacations.length === 0 && (
        <p className="vacation-message">No vacations found for this filter.</p>
      )}

      <div className="vacation-grid">
        {vacations.map(v => (
          <VacationCard
            key={v._id}
            vacation={v}
            onLikeToggle={handleLikeToggle}
          />
        ))}
      </div>

      {pages > 1 && (
        <div className="vacation-pagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span>Page {page} of {pages} &nbsp;·&nbsp; {total} vacations</span>
          <button disabled={page === pages} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  )
}

export default VacationList

