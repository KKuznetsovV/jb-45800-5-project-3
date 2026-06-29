import { Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <Routes>
      {/* routes will be added in subsequent steps */}
      <Route path="/" element={<Navigate to="/vacations" replace />} />
    </Routes>
  )
}

export default App
