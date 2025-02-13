// ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "./ui/Loader";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  
  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated); // Add this
  console.log("ProtectedRoute - isLoading:", isLoading); // Add this

  if (isLoading) {
    return Loader(isLoading);
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}