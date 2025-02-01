import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login } from "../api/api";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export type LoginFormData = {
  email: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      toast.success("Logged in successfully");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      {/* Logo */}
      <header className="bg-black top-0 absolute w-full p-10">
        <img
          src={Logo}
          alt="Company Logo"
          className="ml-20 object-contain"
        />
      </header>
      

      {/* Login Card */}
      <div className="w-full max-w-lg p-8 bg-white shadow-2xl rounded-2xl border border-gray-200">
        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center text-black">
          Welcome Back
        </h2>
        <p className="text-center text-sm text-gray-500 mt-2">
          Please sign in to your account
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          {/* Email Input */}
          <div>
            <label
              className="block text-sm font-semibold text-gray-700"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              className="w-full px-4 py-2 mt-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
              placeholder="example@domain.com"
            />
            <p className="text-xs text-red-500 mt-1">{errors.email?.message}</p>
          </div>

          {/* Password Input */}
          <div>
            <label
              className="block text-sm font-semibold text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              className="w-full px-4 py-2 mt-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
              placeholder="••••••••"
            />
            <p className="text-xs text-red-500 mt-1">{errors.password?.message}</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-4 text-sm font-bold text-white bg-gold-500 rounded-lg hover:bg-gold-600 focus:ring-4 focus:ring-gold-400 focus:outline-none"
          >
            Login
          </button>
        </form>

        
      </div>
    </div>
  );
};

export default Login;
