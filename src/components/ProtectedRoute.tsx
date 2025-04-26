import { Navigate, Outlet } from "react-router-dom";
import { Loader } from "./ui/Loader";
import { selectAuthLoadingStatus, selectIsAuthenticated } from "@/slice/authSlice";
import { useSelector } from "react-redux";

export default function ProtectedRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoadingStatus) === "loading";

  if (isLoading) {
    return Loader(isLoading);
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}