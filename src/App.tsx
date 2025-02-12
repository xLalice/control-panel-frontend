import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "./components/Header";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import UserManagementPage from "./pages/UserManagement/UserManagement";
import LeadsTable from "./pages/Leads/Leads";
import SocialMediaDashboard from "./pages/Social_Media/SocialDashboard";
import ReportsPage from "./pages/Reports/Reports";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const AppContent = () => {
  const location = useLocation();
  const isAuthenticated = useAuth().isAuthenticated;

  // Define pages where the Header should be visible
  const showHeader = !["/", "/login", "/dashboard"].includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}
      <ToastContainer />

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/admin/user-management"
            element={<UserManagementPage />}
          />
          <Route path="/sales/leads" element={<LeadsTable />} />
          <Route
            path="/marketing/social-media"
            element={<SocialMediaDashboard />}
          />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>

        {/* Redirect unknown routes */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
