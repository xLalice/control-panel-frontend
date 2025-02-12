import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import UserManagementPage from "./pages/UserManagement/UserManagement";
import LeadsTable from "./pages/Leads/Leads";
import Dashboard from "./pages/Dashboard/Dashboard";
import SocialMediaDashboard from "./pages/Social_Media/SocialDashboard";
import ReportsPage from "./pages/Reports/Reports";
const App = () => {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/user-management" element={<UserManagementPage />} />
        <Route path="/sales/leads" element={<LeadsTable />} />
        <Route path="/marketing/social-media" element={<SocialMediaDashboard />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
