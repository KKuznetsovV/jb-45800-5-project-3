import { useNavigate } from 'react-router-dom'
import vacationService from '../../services/vacation-service'
import VacationForm from './VacationForm'

function AddVacation() {
  const navigate = useNavigate()

  async function handleSubmit(fd: FormData) {
    await vacationService.add(fd)
    navigate('/vacations')
  }

  return <VacationForm title="Add Vacation" onSubmit={handleSubmit} />
}

export default AddVacation
