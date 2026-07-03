import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { RootState } from '../../redux/store'

interface Props {
  children: React.ReactNode
}

function AuthGuard({ children }: Props) {
  const token = useSelector((state: RootState) => state.auth.token)
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default AuthGuard
