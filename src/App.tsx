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
import ReportsPage from "./pages/Reports/Reports";
import ProductManagementSystem from "./pages/Products/Products";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { Loader } from "./components/ui/Loader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { InquiryManagement } from "./pages/Inquiry/InquiryManagement";
import { DocumentLayout } from "./pages/Documents/components/DocumentLayout";
import AttendancePage from "./pages/Attendance";


import AdminAttendancePage from "./pages/Attendance/admin";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  // Define pages where the Header should be visible
  const showHeader = !["/", "/login", "/dashboard"].includes(location.pathname);

  if (isLoading) {
    return Loader(isLoading);
  }

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
        \
        <Route path="/admin/user-management" element={<UserManagementPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/leads" element={<LeadsTable />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/products" element={<ProductManagementSystem />} />
          <Route path="/inquiries" element={<InquiryManagement />} />
          <Route path="/documents" element={<DocumentLayout />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/attendance/admin" element={<AdminAttendancePage />} />
          

          
        </Route>
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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
