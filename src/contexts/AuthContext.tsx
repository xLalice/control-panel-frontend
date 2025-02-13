import { verify } from "@/api/api";
import { createContext, useContext, useEffect, useState } from "react";
import { login as loginApi, logout as logoutApi } from "@/api/api";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean; 
  login: (data: { email: string; password: string }) => Promise<void>; // ✅ Fixed Type
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Add loading state

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const response: { authenticated: boolean } = await verify();
      console.log("Verify response:", response); // Add this
      setIsAuthenticated(response.authenticated);
      console.log("isAuthenticated set to:", response.authenticated); // Add this
    } catch (error) {
      console.log("Verify error:", error); // Add this
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (data: { email: string; password: string }) => {
    try {
      await loginApi(data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = async () => {
    try{
      await logoutApi();
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
