import React, { useState } from "react";
import "../style/SignUp.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  axios.defaults.withCredentials=true
  const handleDashboard = (event) => {
    event.preventDefault();
    console.log("Logging in as User");

    axios.post('http://localhost:3001/LoginUser', { email, password })
      .then(result => {
        console.log("Response data:", result.data);
        if (result.data.success) {
          toast.success("Login successful!", {
            autoClose: 3000
          });
          localStorage.setItem("userName", result.data.user);
          navigate('/UserPage');  
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
    <div className="bg flex justify-center p-20">
      <div className="wrapper">
        <form onSubmit={handleDashboard}>
          <h1>Login</h1>
          <div className="input-box">
            <label htmlFor="email">Email-Id</label>
            <input
              className="px-5"
              type="text"
              id="email"
              placeholder="Email Id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <i className="bx bx-lock"></i>
          </div>
          <div className="input-box">
            <label htmlFor="password">Password</label>
            <input
              className="px-5"
              type="password"
              placeholder="Password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn">
            Login
          </button>
          <button id="oauth" className="p-2">
            <a href="/oauth">Login with Google</a>
          </button>
          <div className="text-sm px-3">
            <p>Not Registered?</p>
            <button
              className="text-sky-900 px-0 py-0"
              id="register"
              onClick={handleRegistration}
            >
              Click here
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default LoginPage;
