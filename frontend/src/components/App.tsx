import { Routes, Route, Navigate } from 'react-router-dom'
import AuthGuard from './routing/AuthGuard'
import AdminGuard from './routing/AdminGuard'
import GuestGuard from './routing/GuestGuard'
import Layout from './layout/Layout'
import Register from './auth/Register'
import Login from './auth/Login'
import VacationList from './vacations/VacationList'
import About from './about/About'
import AddVacation from './admin/AddVacation'
import EditVacation from './admin/EditVacation'
import AiRecommend from './ai/AiRecommend'
import McpChat from './mcp/McpChat'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/vacations" replace />} />

      {/* guest-only routes */}
      <Route path="/register" element={<GuestGuard><Register /></GuestGuard>} />
      <Route path="/login"    element={<GuestGuard><Login /></GuestGuard>} />

      {/* protected routes — navbar + content */}
      <Route element={<AuthGuard><Layout /></AuthGuard>}>
        <Route path="/vacations"       element={<VacationList />} />
        <Route path="/about"           element={<About />} />
        <Route path="/ai"              element={<AiRecommend />} />
        <Route path="/mcp"             element={<McpChat />} />
        <Route path="/admin/add"       element={<AdminGuard><AddVacation /></AdminGuard>} />
        <Route path="/admin/edit/:id"  element={<AdminGuard><EditVacation /></AdminGuard>} />
      </Route>

      <Route path="*" element={<Navigate to="/vacations" replace />} />
    </Routes>
  )
}

export default App

