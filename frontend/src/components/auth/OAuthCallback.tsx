import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import store from '../../redux/store'
import { login } from '../../redux/auth-slice'

function OAuthCallback() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const token    = params.get('token')
    const userJson = params.get('user')

    if (token && userJson) {
      try {
        const user = JSON.parse(decodeURIComponent(userJson))
        store.dispatch(login({ user, token }))
        navigate('/vacations', { replace: true })
      } catch {
        navigate('/login?error=oauth_failed', { replace: true })
      }
    } else {
      navigate('/login', { replace: true })
    }
  }, [])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <p>Signing you in…</p>
    </div>
  )
}

export default OAuthCallback
