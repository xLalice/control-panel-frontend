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
import { 
  Bell, 
  Menu,
  Home,
  Users,
  DollarSign,
  Megaphone,
  Package,
  ChevronDown,
  BarChart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Logo from "../../assets/logo.png"

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

type MenuItems = {
  [key: string]: {
    name: string;
    route: string;
    icon: React.ReactNode;
  }[];
};

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems: MenuItems = {
    Dashboard: [],
    Admin: [{ name: "User Management", route: "/admin/user-management", icon: <Users className="h-4 w-4" /> }],
    Sales: [{ name: "Leads", route: "/sales/leads", icon: <DollarSign className="h-4 w-4" /> }],
    Marketing: [{ name: "Campaigns", route: "/marketing/campaigns", icon: <Megaphone className="h-4 w-4" /> }],
    Logistics: [{ name: "Inventory", route: "/logistics/inventory", icon: <Package className="h-4 w-4" /> }],
    Reports: [{ name: "View Reports", route: "/reports", icon: <BarChart className="h-4 w-4" /> }],
  };

  const handleMenuClick = (menu: string) => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const doughnutData = {
    labels: ["Sales", "Marketing", "Logistics"],
    datasets: [
      {
        data: [300, 200, 100],
        backgroundColor: ["#22c55e", "#eab308", "#ef4444"],
      },
    ],
  };

  const barData = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Revenue",
        data: [1200, 1900, 3000, 2500, 3200],
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const Sidebar = () => (
    <div className="h-screen border-r bg-background">
      <div className="p-4 flex justify-between items-center border-b bg-black">
        <img src={Logo} alt="Company Logo" className=" w-full" />
      </div>
      <nav className="space-y-1 p-2 ">
        {Object.keys(menuItems).map((menu) => (
          <div key={menu} className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleMenuClick(menu)}
            >
              <Home className="h-4 w-4 mr-2" />
              {menu}
              {menuItems[menu].length > 0 && (
                <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${
                  activeMenu === menu ? "transform rotate-180" : ""
                }`} />
              )}
            </Button>
            {activeMenu === menu && menuItems[menu].length > 0 && (
              <div className="pl-4 space-y-1">
                {menuItems[menu].map((item) => (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate(item.route)}
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="ml-2">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b bg-background flex items-center justify-between px-4">
          <h1 className="text-lg font-semibold">Welcome Back</h1>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>New message received</DropdownMenuItem>
                <DropdownMenuItem>Sales target achieved</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <Doughnut data={doughnutData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <Bar data={barData} />
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2025-01-26</TableCell>
                    <TableCell>Purchase Order #123</TableCell>
                    <TableCell>₱15,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2025-01-25</TableCell>
                    <TableCell>Invoice #456</TableCell>
                    <TableCell>₱22,500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2025-01-24</TableCell>
                    <TableCell>Salary Payment</TableCell>
                    <TableCell>₱50,000</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default App;