import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import EventsPage from "./pages/events-page";
import StatusPage from "./pages/status-page";
import LoginPage from "./pages/login";
import AdminDashboard from "./pages/admin-dashboard";
import UserDashboard from "./pages/user-dashboard";
import { AuthContext } from "./context/authContext";
import { Analytics } from "@vercel/analytics/react"
// Protected Route Component
const ProtectedRoute = ({ element, requiredRole }: { element: JSX.Element; requiredRole?: string }) => {
  const { isAuthenticated, role } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />; // Redirect to login if not authenticated
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to={role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return element;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/status/:user" element={<ProtectedRoute element={<StatusPage />} />} />
          <Route path="/status/:user/events" element={<ProtectedRoute element={<EventsPage />} />} />

          {/* Role-Based Routes */}
          <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<UserDashboard />} requiredRole="user" />} />

        </Routes>
      </div>
      <Analytics />
    </Router>
  );
}

export default App;
