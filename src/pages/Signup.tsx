import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { register as signup } from "../api/api";

export type SignupFormData = {
  email: string,
  password: string,
  confirmPassword: string,
  name: string
}

const signupSchema = yup.object().shape({
  name: yup.string().min(6, "Name must be at least 6 characters").required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    const response = await signup(data);
    
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">Name</label>
            <input
              type="text"
              {...register("name")}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <p className="text-sm text-red-500">{errors.name?.message}</p>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <p className="text-sm text-red-500">{errors.email?.message}</p>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <p className="text-sm text-red-500">{errors.password?.message}</p>
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-600">Confirm Password</label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <p className="text-sm text-red-500">{errors.confirmPassword?.message}</p>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
