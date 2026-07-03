import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { RootState } from '../../redux/store'

interface Props {
  children: React.ReactNode
}

function GuestGuard({ children }: Props) {
  const token = useSelector((state: RootState) => state.auth.token)
  if (token) return <Navigate to="/vacations" replace />
  return <>{children}</>
}

export default GuestGuard
