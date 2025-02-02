import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import EventsPage from "./pages/events-page"
import StatusPage from "./pages/status-page"
import LoginPage from "./pages/login"
import AdminDashboard from "./pages/admin-dashboard"
import UserDashboard from "./pages/user-dashboard"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<UserDashboard />} />          
          <Route path="/:user" element={<StatusPage />} />
          <Route path="/:user/events" element={<EventsPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

