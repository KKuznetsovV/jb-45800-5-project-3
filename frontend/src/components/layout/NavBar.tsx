import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../redux/auth-slice'
import { RootState } from '../../redux/store'
import './NavBar.css'

function NavBar() {
  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function handleLogout() {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <span className="navbar-brand">✈ Vacations</span>
      {user && (
        <div className="navbar-user">
          <span>Hello, {user.firstName} {user.lastName}</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  )
}

export default NavBar
