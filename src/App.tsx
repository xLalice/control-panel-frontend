import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import UserManagementPage from "./pages/UserManagement/UserManagement";
import LeadsTable from "./pages/Leads/Leads";
const App = () => {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/user-management" element={<UserManagementPage />} />
        <Route path="/sales/leads" element={<LeadsTable />} />
      </Routes>
    </Router>
  );
};

export default App;
