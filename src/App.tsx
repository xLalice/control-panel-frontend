import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import UserManagementPage from "./pages/UserManagement/UserManagement";
const App = () => {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/user-management" element={<UserManagementPage />} />
      </Routes>
    </Router>
  );
};

export default App;
