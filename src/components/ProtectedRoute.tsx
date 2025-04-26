import { Navigate, Outlet } from "react-router-dom";
import { Loader } from "./ui/Loader";
import { selectIsAuthenticated } from "@/store/slice/authSlice";
import { useAppSelector } from "@/store/store";

export default function ProtectedRoute() {
  const isAuthInitialized = useAppSelector(
    (state) => state.auth.isAuthInitialized
  );
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!isAuthInitialized) {
    return Loader();
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
