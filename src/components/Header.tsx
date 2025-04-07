import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { Button } from "@/components/ui/button";
import {toast} from "react-toastify"
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { logout } = useAuth();
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const navigate = useNavigate();
  return (
    <header className="bg-black text-white shadow-md sticky top-0 z-50">
      <div className="w-full flex items-center justify-between py-4 px-6">
        <img
          src={Logo}
          className="h-10"
          alt="Company Logo"
          onClick={() => navigate("/")}
        />
        <Button variant="destructive" className="ml-auto" onClick={() => handleLogout()}>
          Logout
        </Button>
      </div>
    </header>
  );
}
