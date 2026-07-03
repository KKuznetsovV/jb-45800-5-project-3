import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import VacationModel from '../../models/VacationModel'
import vacationService from '../../services/vacation-service'
import VacationForm from './VacationForm'

function EditVacation() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [vacation, setVacation] = useState<VacationModel | null>(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    if (!id) return
    vacationService.getOne(id)
      .then(setVacation)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  async function handleSubmit(fd: FormData) {
    await vacationService.update(id!, fd)
    navigate('/vacations')
  }

  if (loading)  return <p style={{ padding: '2rem' }}>Loading...</p>
  if (!vacation) return <p style={{ padding: '2rem' }}>Vacation not found.</p>

  return <VacationForm title="Edit Vacation" initialVacation={vacation} onSubmit={handleSubmit} />
}

export default EditVacation
