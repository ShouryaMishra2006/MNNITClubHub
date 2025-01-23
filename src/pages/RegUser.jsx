import React, { useState } from "react";
import "../style/SignUp.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3001/RegUser", { name, email, password })
      .then((result) => {
        console.log(result);
        if (result.data.success) {
          toast.success("Registration successful!", {
            autoClose: 3000,
          });
          navigate("/LoginUser");
        } else {
          if (result.data.message === "User already registered") {
            toast.error("Registration failed: User already registered", {
              autoClose: 3000,
            });
          } else {
            toast.error("Registration failed: " + result.data.message, {
              autoClose: 3000,
            });
          }
        }
      })
      .catch((err) => {
        console.log("Error in registration request:", err);
        toast.error("Email already exists", {
          autoClose: 3000,
        });
      });
  };

  return (
    <div className="bg flex justify-center items-center min-h-screen p-5">
      <div className="wrapper shadow-lg rounded-lg bg-white p-10">
        <form onSubmit={handleSubmit}>
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Create Your Account
          </h1>
          <div className="input-box mb-4">
            <label htmlFor="name" className="block text-sm text-gray-700 mb-1">
              Name
            </label>
            <input
              className="px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              type="text"
              name="name"
              id="name"
              placeholder="Full Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div className="input-box mb-4">
            <label
              htmlFor="email"
              className="block text-sm text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              className="px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="input-box mb-6">
            <label
              htmlFor="password"
              className="block text-sm text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              className="px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              type="password"
              placeholder="Password"
              name="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <button
            type="submit"
            className="btn w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition duration-200"
          >
            Register
          </button>
          <div className="text-center text-sm text-gray-600 mt-4">
            or
          </div>
          <button
            onClick={() =>
              (window.location.href = `http://localhost:3001/auth/google`)
            }
            id="oauth"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition duration-200 mt-4"
          >
            Register using Google
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default SignUpPage;
