import React, { useState } from "react";
import "../style/SignUp.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_BASE_URL from "../config";
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleDashboard = (event) => {
    event.preventDefault();
    console.log("Logging in as User");

    axios.post(`${API_BASE_URL}/LoginUser`, { email, password })
      .then(result => {
        console.log("Response data:", result.data);
        if (result.data.success) {
          toast.success("Login successful!", {
            autoClose: 3000
          });
          localStorage.setItem("userName", result.data.user);
          navigate(`/UserPage/${result.data.user}`);
        } else {
          toast.error("Login failed: " + result.data.message, {
            autoClose: 3000
          });
        }
      })
      .catch(err => {
        console.log("Error in login request:", err);
        toast.error("An error occurred during login.", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000
        });
      });
  };

  const handleRegistration = () => {
    navigate('/RegUser');
  };

  return (
    <div className="bg flex flex-col items-center justify-center min-h-screen p-10">
      <div className="wrapper bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Login to continue to your dashboard.
        </p>
        <form onSubmit={handleDashboard} className="space-y-6">
          <div className="input-box">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
              Email Address
            </label>
            <input
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              type="text"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-box">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2  rounded-lg shadow-md hover:bg-purple-500 transition-all"
          >
            Login
          </button>
        </form>
        <div className="mt-6 flex items-center justify-between">
          <hr className="flex-1 border-t border-gray-300" />
          <span className="text-sm text-gray-500 px-2">OR</span>
          <hr className="flex-1 border-t border-gray-300" />
        </div>
        <button
        onClick={() =>
          (window.location.href = `${API_BASE_URL}/auth/google`)
        }
          id="oauth"
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg shadow-md hover:bg-blue-400 transition-all"
        >
          Login with Google
        </button>
        <p className="mt-6 text-center text-gray-600">
          Not registered yet?{" "}
          <button
            className="text-purple-600 font-semibold hover:underline"
            id="register"
            onClick={handleRegistration}
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
