import React, { useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

type MenuItems = {
  [key: string]: {name: string, route: string}[];
};

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Menu items and their associated features
  const menuItems: MenuItems = {
    Dashboard: [],
    Admin: [{name :"User Management", route: "/admin/user-management" }],
    Sales: [{name: "Leads", route: "/sales/leads"}],
    Marketing: [{name: "Campaigns", route: "/marketing/campaigns"}],
    Logistics: [{name: "Inventory", route: "/logistics/inventory"}],
  };

  const handleMenuClick = (menu: string) => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  const handleLogout = async () => {
   try {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login")
   } catch(error){
    toast.error("Logout failed");
   }

  }

  // Sample data for charts
  const doughnutData = {
    labels: ["Sales", "Marketing", "Logistics"],
    datasets: [
      {
        data: [300, 200, 100],
        backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
      },
    ],
  };

  const barData = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Revenue",
        data: [1200, 1900, 3000, 2500, 3200],
        backgroundColor: "#007BFF",
      },
    ],
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="bg-black text-white w-64 fixed h-screen flex-shrink-0">
          <div className="p-4 flex justify-between items-center">
            <img src={Logo} alt="" />
            
          </div>
          <nav className="space-y-2">
            {Object.keys(menuItems).map((menu) => (
              <div key={menu}>
                <button
                  onClick={() => handleMenuClick(menu)}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-700 ${
                    activeMenu === menu ? "bg-gray-700" : ""
                  }`}
                >
                  {menu}
                </button>
                {activeMenu === menu && (
                  <ul className="ml-6 space-y-1 mt-2">
                    {menuItems[menu].map((feature) => (
                      <li
                        key={feature.name}
                        className="text-sm bg-gray-800 px-4 py-2 rounded hover:bg-gray-700"
                        onClick={() => navigate(feature.route)}
                      >
                        {feature.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? "ml-64" : ""}`}>
        {/* Header */}
        <header className="flex items-center justify-between bg-black text-yellow-500 px-6 py-4">
          <button onClick={toggleSidebar} className="text-white">
            {sidebarOpen ? "Close" : "Open"} Menu
          </button>
          <div className="flex items-center space-x-4">
            <Bell className="h-6 w-6 cursor-pointer" />
            <button className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600" onClick={() => handleLogout()}>
              Logout
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 space-y-6 overflow-auto">
          {/* Chart Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-4">Department Distribution</h3>
              <Doughnut data={doughnutData} />
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-4">Monthly Revenue</h3>
              <Bar data={barData} />
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4">Recent Transactions</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2">2025-01-26</td>
                  <td className="px-4 py-2">Purchase Order #123</td>
                  <td className="px-4 py-2">₱15,000</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2">2025-01-25</td>
                  <td className="px-4 py-2">Invoice #456</td>
                  <td className="px-4 py-2">₱22,500</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">2025-01-24</td>
                  <td className="px-4 py-2">Salary Payment</td>
                  <td className="px-4 py-2">₱50,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
