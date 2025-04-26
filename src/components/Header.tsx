import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { Button } from "@/components/ui/button";
import {toast} from "react-toastify"
import { useAppDispatch } from "@/store/store";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "@/store/slice/authSlice";

export default function Header() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  
  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      queryClient.removeQueries()
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "Logout failed";
      toast.error(errMessage);
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
