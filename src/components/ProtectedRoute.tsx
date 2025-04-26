import { Navigate, Outlet } from "react-router-dom";
import { Loader } from "./ui/Loader";
import { selectAuthLoadingStatus, selectIsAuthenticated } from "@/store/slice/authSlice";
import { useSelector } from "react-redux";

export default function ProtectedRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authStatus = useSelector(selectAuthLoadingStatus); 

  if (authStatus === "loading" || authStatus === "idle") {
    return Loader(authStatus === "loading");
  }

  if (authStatus === "failed" || !isAuthenticated) {
    return <Navigate to="/login" replace />; 
  }

  return <Outlet />; 
}