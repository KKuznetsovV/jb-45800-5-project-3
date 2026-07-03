import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../../services/auth-service'
import './Auth.css'

function Register() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [error, setError]         = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await authService.register(firstName, lastName, email, password)
      navigate('/vacations')
    } catch (err: any) {
      setError(err.response?.data || 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        {error && <p className="auth-error">{error}</p>}

        <label>First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          required
          minLength={1}
          maxLength={30}
          placeholder="First name"
        />

        <label>Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          required
          minLength={1}
          maxLength={30}
          placeholder="Last name"
        />

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
          placeholder="Password (min 4 characters)"
        />

        <button type="submit">Register</button>

        <div className="auth-divider"><span>or</span></div>

        <button type="button" className="btn-google" onClick={() => window.location.href = '/api/auth/google'}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" />
          Sign up with Google
        </button>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  )
}

export default Register
