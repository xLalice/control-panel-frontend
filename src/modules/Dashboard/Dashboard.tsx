import React, { useMemo } from "react";
import {
  Bell,
  Menu,
  Loader,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo from "../../assets/logo.png";
import CompanyPolicyDashboard from "../Stats/Stats";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { logout } from "@/store/slice/authSlice";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { getMenuItems } from "./MenuItems";

const App: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthInitialized = useAppSelector(
    (state) => state.auth.isAuthInitialized
  );
  const perms = useUserPermissions();

  const menuItems = useMemo(() => getMenuItems(perms), [perms]);


  const handleNavigation = (route: string) => {
    if (route.startsWith("http")) {
      window.location.href = route;
    } else {
      navigate(route);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      toast.success("Logged out successfully");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  const Sidebar = () => (
    <div className="h-screen border-r bg-background">
      <div className="p-4 flex justify-between items-center border-b bg-black">
        <img src={Logo} alt="Company Logo" className="w-full" />
      </div>
      <nav className="space-y-1 p-2">
        <div className="pl-4 space-y-1">
          {menuItems
            .filter((item) => item.visible)
            .map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleNavigation(item.route)}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Button>
            ))}
        </div>
      </nav>
    </div>
  );

  if (!isAuthInitialized) {
    return <Loader />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
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
          <CompanyPolicyDashboard />
        </main>
      </div>
    </div>
  );
};

export default App;
