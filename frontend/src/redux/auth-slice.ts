import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import UserModel from '../models/UserModel'

interface AuthState {
  user: UserModel | null
  token: string | null
}

function getInitialState(): AuthState {
  const token = localStorage.getItem('token')
  const userJson = localStorage.getItem('user')
  return {
    token,
    user: userJson ? JSON.parse(userJson) : null
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    login(state, action: PayloadAction<{ user: UserModel; token: string }>) {
      state.user = action.payload.user
      state.token = action.payload.token
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },
    logout(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
