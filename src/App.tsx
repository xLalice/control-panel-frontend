import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "./components/Header";
import Login from "./modules/Login";
import Dashboard from "./modules/Dashboard/Dashboard";
import UserManagementPage from "./modules/UserManagement/UserManagement";
import LeadsTable from "./modules/Leads/Leads";
import ReportsPage from "./modules/Reports/Reports";
import ProductManagementSystem from "./modules/Products/Products";
import ProtectedRoute from "./components/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { InquiryManagement } from "./modules/Inquiry/InquiryManagement";
import { DocumentLayout } from "./modules/Documents/components/DocumentLayout";
import AttendancePage from "./modules/Attendance";
import AdminAttendancePage from "./modules/Attendance/admin";
import { fetchCurrentUser, selectIsAuthenticated } from "./store/slice/authSlice";
import { useSelector } from "react-redux";
import { useAppDispatch } from "./store/store";
import { useEffect } from "react";
import { ClientList } from "./modules/Clients/components/ClientList/ClientList";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

const AppContent = () => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
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
        \
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user-management" element={<UserManagementPage />} />
          <Route path="/leads" element={<LeadsTable />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/products" element={<ProductManagementSystem />} />
          <Route path="/inquiries" element={<InquiryManagement />} />
          <Route path="/documents" element={<DocumentLayout />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/attendance/admin" element={<AdminAttendancePage />} />
          <Route path="/clients" element={<ClientList />} />
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
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch])

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
      </Router>
    </QueryClientProvider>
  );
};

export default App;
