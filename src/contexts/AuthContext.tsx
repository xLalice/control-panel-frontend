import { verify, login as loginApi, logout as logoutApi } from "@/api/api";
import { createContext, useContext, useEffect, useState } from "react";

// Define the user type (adjust based on your backend response)
interface User {
  id: string;
  name: string;
  email: string;
}

// Update AuthContext type
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    user: User | null;
  }>({
    isAuthenticated: false,
    user: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const response: { authenticated: boolean; user?: User } = await verify();
      setAuthState({
        isAuthenticated: response.authenticated,
        user: response.authenticated && response.user ? response.user : null, 
      });
    } catch (error) {
      console.log("Verify error:", error);
      setAuthState({ isAuthenticated: false, user: null });
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
      // After login, fetch auth status and user data
      await checkAuth();
    } catch (error) {
      console.error("Login failed", error);
      throw error; // Optional: rethrow for component handling
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
      setAuthState({ isAuthenticated: false, user: null });
    } catch (error) {
      console.error("Logout failed", error);
      throw error; 
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        user: authState.user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};