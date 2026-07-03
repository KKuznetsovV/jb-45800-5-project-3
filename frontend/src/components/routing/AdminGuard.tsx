import { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { RootState } from '../../redux/store'

function AdminGuard({ children }: { children: ReactNode }) {
  const role = useSelector((state: RootState) => state.auth.user?.role)
  if (role !== 'admin') return <Navigate to="/vacations" replace />
  return <>{children}</>
}

export default AdminGuard
