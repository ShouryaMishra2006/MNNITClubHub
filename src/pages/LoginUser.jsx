import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LogIn } from "lucide-react";
import API_BASE_URL from "../config";
import { useAuth } from "../contexts/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  axios.defaults.withCredentials = true;

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("rememberedEmail");
    const storedRemember = localStorage.getItem("rememberMe");

    if (storedRemember === "true" && storedEmail) {
      setRememberMe(true);
      setFormData(prev => ({ ...prev, email: storedEmail }));
    }
  }, []);

  useEffect(() => {
    if (rememberMe && formData.email !== "") {
      localStorage.setItem("rememberedEmail", formData.email);
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberMe");
    }
  }, [rememberMe, formData.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDashboard = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post(`${API_BASE_URL}/LoginUser`, formData);
      if (result.data.success) {
        console.log(result.data)
        toast.success("Login successful!", { autoClose: 3000 });
        login({ name: result.data.user, email: formData.email });
        console.log(result.data)
        localStorage.setItem("userName", result.data.user);
        navigate(`/UserPage/${result.data.user}`);
      } else {
        toast.error("Login failed: " + result.data.message, { autoClose: 3000 });
      }
    } catch (err) {
      toast.error("An error occurred during login.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000
      });
    }
  };

  const handleRegistration = () => navigate('/RegUser');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center px-4 py-8">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-10 max-w-md w-full border border-gray-200">
        <div className="flex items-center justify-center mb-6">
          <LogIn className="h-8 w-8 text-blue-700 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
        </div>

        <p className="text-center text-gray-600 mb-8">
          Login to continue to your dashboard.
        </p>

        <form onSubmit={handleDashboard} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
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

          <div className="flex items-center text-sm text-gray-600">
            <input
              id="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="mr-2"
            />
            <label htmlFor="remember">Remember Me</label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md font-semibold"
          >
            Login
          </button>
        </form>

        <div className="flex items-center justify-between my-6">
          <hr className="flex-1 border-gray-300" />
          <span className="px-2 text-sm text-gray-500">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <button
          onClick={() => window.location.href = `${API_BASE_URL}/auth/google/login`}
          className="w-full bg-red-500 text-white py-2 rounded-lg shadow-md hover:bg-red-600 transition-all font-semibold"
        >
          Login with Google
        </button>

        <p className="mt-6 text-center text-gray-600">
          Not registered yet?{" "}
          <button
            onClick={handleRegistration}
            className="text-blue-700 font-semibold hover:underline"
          >
            Register here
          </button>
        </p>
        <ToastContainer />
      </div>
    </div>
  );
}

export default LoginPage;
