import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
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
      <div className="navbar-left">
        <Link to="/vacations" className="navbar-brand">✈ Vacations</Link>
        <Link to="/about" className="navbar-link">About</Link>
        <Link to="/ai" className="navbar-link">AI Tips</Link>
        <Link to="/mcp" className="navbar-link">Ask AI</Link>
        {user?.role === 'admin' && (
          <>
            <Link to="/report" className="navbar-link">Report</Link>
            <Link to="/admin/add" className="navbar-link navbar-link-admin">+ Add Vacation</Link>
          </>
        )}
      </div>
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
