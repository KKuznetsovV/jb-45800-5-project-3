import { Routes, Route, Navigate } from 'react-router-dom'
import AuthGuard from './routing/AuthGuard'
import GuestGuard from './routing/GuestGuard'
import Layout from './layout/Layout'
import Register from './auth/Register'
import Login from './auth/Login'
import VacationList from './vacations/VacationList'
import About from './about/About'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/vacations" replace />} />

      {/* guest-only routes */}
      <Route path="/register" element={<GuestGuard><Register /></GuestGuard>} />
      <Route path="/login"    element={<GuestGuard><Login /></GuestGuard>} />

      {/* protected routes — navbar + content */}
      <Route element={<AuthGuard><Layout /></AuthGuard>}>
        <Route path="/vacations" element={<VacationList />} />
        <Route path="/about"     element={<About />} />
      </Route>

      <Route path="*" element={<Navigate to="/vacations" replace />} />
    </Routes>
  )
}

export default App

