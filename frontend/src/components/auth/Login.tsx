import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../../services/auth-service'
import './Auth.css'

function Login() {
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await authService.login(email, password)
      navigate('/vacations')
    } catch (err: any) {
      setError(err.response?.data || 'Login failed. Please check your credentials.')
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>

        {error && <p className="auth-error">{error}</p>}

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          placeholder="Email address"
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={4}
          placeholder="Password"
        />

        <button type="submit">Login</button>

        <div className="auth-divider"><span>or</span></div>

        <button type="button" className="btn-google" onClick={() => window.location.href = '/api/auth/google'}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" />
          Continue with Google
        </button>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  )
}

export default Login
