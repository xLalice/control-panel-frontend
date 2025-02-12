import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { Button } from "@/components/ui/button";


export default function Header() {

    const navigate = useNavigate();
  return (
    <header className="bg-black text-white shadow-md sticky top-0 z-50">
      <div className="w-full flex items-center justify-between py-4 px-6">
            <img src={Logo} className="h-10" alt="Company Logo" onClick={() => navigate("/")} />
        <Button variant="destructive" className="ml-auto">
          Logout
        </Button>
      </div>
    </header>
  );
}
