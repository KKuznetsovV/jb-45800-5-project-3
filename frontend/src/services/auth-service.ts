import api from './api'
import store from '../redux/store'
import { login as loginAction, logout as logoutAction } from '../redux/auth-slice'

async function register(firstName: string, lastName: string, email: string, password: string): Promise<void> {
  const response = await api.post('/auth/register', { firstName, lastName, email, password })
  store.dispatch(loginAction({ user: response.data.user, token: response.data.token }))
}

async function login(email: string, password: string): Promise<void> {
  const response = await api.post('/auth/login', { email, password })
  store.dispatch(loginAction({ user: response.data.user, token: response.data.token }))
}

function logout(): void {
  store.dispatch(logoutAction())
}

const authService = { register, login, logout }
export default authService

