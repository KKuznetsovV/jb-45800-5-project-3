import { useSelector } from 'react-redux'
import VacationModel from '../../models/VacationModel'
import { RootState } from '../../redux/store'
import './VacationCard.css'

interface Props {
  vacation: VacationModel
  onLikeToggle: (vacationId: string, isLiked: boolean) => void
  onEdit?: (vacation: VacationModel) => void
  onDelete?: (vacationId: string) => void
}

function VacationCard({ vacation, onLikeToggle, onEdit, onDelete }: Props) {
  const role = useSelector((state: RootState) => state.auth.user?.role)

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="vacation-card">
      <div className={`vacation-card-image-wrap${vacation.imageName ? '' : ' no-image'}`}>
        {vacation.imageName && (
          <img
            src={`/uploads/${vacation.imageName}`}
            alt={vacation.destination}
            onError={(e) => {
              const img = e.target as HTMLImageElement
              img.style.display = 'none'
              img.parentElement!.classList.add('no-image')
            }}
          />
        )}
        <button
          className={`like-btn ${vacation.isLiked ? 'liked' : ''}`}
          onClick={() => onLikeToggle(vacation._id, vacation.isLiked)}
          title={vacation.isLiked ? 'Unlike' : 'Like'}
        >
          {vacation.isLiked ? '❤️' : '🤍'} {vacation.likesCount}
        </button>
      </div>

      <div className="vacation-card-body">
        <h3 className="vacation-destination">{vacation.destination}</h3>
        <p className="vacation-dates">📅 {fmt(vacation.startDate)} – {fmt(vacation.endDate)}</p>
        <p className="vacation-price">${vacation.price.toLocaleString()}</p>
        <p className="vacation-description">{vacation.description}</p>
      </div>

      {role === 'admin' && (
        <div className="vacation-card-admin">
          <button className="btn-edit" onClick={() => onEdit?.(vacation)}>✏️ Edit</button>
          <button className="btn-delete" onClick={() => onDelete?.(vacation._id)}>🗑️ Delete</button>
        </div>
      )}
    </div>
  )
}

export default VacationCard
