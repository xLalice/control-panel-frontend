import axios from "axios";
import { LoginFormData } from "../pages/Login";
import { SignupFormData } from "../pages/Signup";

const baseURL = `${import.meta.env.VITE_API_URL}/api/`;

const apiClient = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json"
    }
});

export const register = async (data: SignupFormData) => {
  try {
    const response = await apiClient.post('/auth/register', data);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Registration failed');
  }
};

export const login = async (data: LoginFormData) => {
  try {
    const response = await apiClient.post('/auth/login', data);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};
  

  export const logout = async () => {
    try {
      await apiClient.post('/logout'); 
    } catch (error: any) {
      throw new Error('Logout failed');
    }
  };
