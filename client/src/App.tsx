import { Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import EventsPage from "./pages/events-page";
import StatusPage from "./pages/status-page";
import LoginPage from "./pages/login";
import AdminDashboard from "./pages/admin-dashboard";
import UserDashboard from "./pages/user-dashboard";
import { AuthContext } from "./context/authContext";
import { Analytics } from "@vercel/analytics/react";
import ServicesPage from "./pages/services";
import MaintenancePage from "./pages/maintenance";
import { Toaster } from "@/components/ui/toaster"
import IncidentsPage from "./pages/incidents";
import { TeamList } from "./pages/team-list";

const ProtectedRoute = ({ element, requiredRole }: { element: JSX.Element; requiredRole?: string }) => {
  const { isAuthenticated, role } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to={role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return element;
};

function App() {
  return (
    <>
      <div className="min-h-screen bg-background">
        <Routes>

          <Route path="/" element={<LoginPage />} />
          <Route path="/status/:userId" element={<StatusPage />} />
          <Route path="/status/:userId/events" element={<EventsPage />} />


          <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />}>
            <Route index element={<TeamList />} />
          </Route>


          <Route path="/dashboard" element={<ProtectedRoute element={<UserDashboard />} requiredRole="user" />}>
            <Route index element={<ServicesPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="incidents" element={<IncidentsPage />} />
            <Route path="maintenance" element={<MaintenancePage />} />
          </Route>
        </Routes>
        <Toaster />
      </div>
      <Analytics />
    </>
  );
}

export default App;
