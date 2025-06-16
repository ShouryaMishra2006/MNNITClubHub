import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LogIn } from "lucide-react";
import API_BASE_URL from "../config";
import { useAuth } from "../contexts/AuthContext";

function SignUpPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(`${API_BASE_URL}/RegUser`, formData);
      if (result.data.success) {
        toast.success("Registration successful!", { autoClose: 3000 });
        login({ name: formData.name, email: formData.email });
        localStorage.setItem("userName", formData.name);
        navigate(`/UserPage/${formData.name}`);
      } else {
        toast.error("Registration failed: " + result.data.message, {
          autoClose: 3000,
        });
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(`Registration failed: ${errorMsg}`, {
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center px-4 py-8">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-10 max-w-md w-full border border-gray-200">
        <div className="flex items-center justify-center mb-6">
          <LogIn className="h-8 w-8 text-blue-700 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
        </div>

        <p className="text-center text-gray-600 mb-8">
          Register to get started with your dashboard.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md font-semibold"
          >
            Register
          </button>
        </form>

        <div className="flex items-center justify-between my-6">
          <hr className="flex-1 border-gray-300" />
          <span className="px-2 text-sm text-gray-500">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <button
          onClick={() => (window.location.href = `${API_BASE_URL}/auth/google`)}
          className="w-full bg-red-500 text-white py-2 rounded-lg shadow-md hover:bg-red-600 transition-all font-semibold"
        >
          Register with Google
        </button>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/LoginUser")}
            className="text-blue-700 font-semibold hover:underline"
          >
            Login here
          </button>
        </p>
        <ToastContainer />
      </div>
    </div>
  );
}

export default SignUpPage;
