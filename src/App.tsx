import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "./components/Header";
import Login from "./modules/Auth/Login";
import Dashboard from "./modules/Dashboard/Dashboard";
import UserManagementPage from "./modules/UserManagement/UserManagement";
import LeadsTable from "./modules/Leads/Leads";
import ReportsPage from "./modules/Reports/Reports";
import ProductManagementSystem from "./modules/Products/Products";
import SalesOrdersTable from "./modules/SalesOrder/SalesOrder";
import ProtectedRoute from "./modules/Auth/ProtectedRoute";
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
import { QuotationsPage } from "./modules/Quotations/Quotation";
import { ROUTES } from "./routes";

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
  const showHeader = ![ROUTES.LOGIN, ROUTES.DASHBOARD].includes(location.pathname as typeof ROUTES.LOGIN | typeof ROUTES.DASHBOARD);

  return (
    <>
      {showHeader && <Header />}
      <ToastContainer />

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <Login />
          }
        />
        <Route
          path={ROUTES.LOGIN}
          element={
            isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <Login />
          }
        />
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.USER_MANAGEMENT} element={<UserManagementPage />} />
          <Route path={ROUTES.LEADS} element={<LeadsTable />} />
          <Route path={`${ROUTES.LEADS}/:id`} element={<LeadsTable />} />
          <Route path={ROUTES.REPORTS} element={<ReportsPage />} />
          <Route path={ROUTES.PRODUCTS} element={<ProductManagementSystem />} />
          <Route path={ROUTES.INQUIRIES} element={<InquiryManagement />} />
          <Route path={ROUTES.DOCUMENTS} element={<DocumentLayout />} />
          <Route path={ROUTES.ATTENDANCE} element={<AttendancePage />} />
          <Route path={ROUTES.ADMIN_ATTENDANCE} element={<AdminAttendancePage />} />
          <Route path={ROUTES.CLIENTS} element={<ClientList />} />
          <Route path={ROUTES.QUOTES} element={<QuotationsPage />} />
          <Route path={`${ROUTES.QUOTES}/:id`} element={<QuotationsPage />} />
          <Route path={ROUTES.SALES_ORDERS} element={<SalesOrdersTable />} />
        </Route>
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN} />
          }
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
