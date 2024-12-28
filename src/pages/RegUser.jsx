import React, { useState } from "react";
import "../style/SignUp.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3001/RegUser', { name, email, password })
      .then(result => {
        console.log(result);
        if (result.data.success) {
          toast.success("Registration successful!", {
            autoClose: 3000
          });
          navigate('/LoginUser');  
        } else {
          if (result.data.message === "User already registered") {
            toast.error("Registration failed: User already registered", {
              autoClose: 3000
            });
          } else {
            toast.error("Registration failed: " + result.data.message, {
              autoClose: 3000
            });
          }
        }
      })
      .catch(err => {
        console.log("Error in registration request:", err);
        toast.error("email already exists", {
          autoClose: 3000
        });
      });
  };

  return (
    <div className="bg flex justify-center p-20">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Register</h1>
          <div className="input-box">
            <label htmlFor="name">Name</label>
            <input
              className="px-5"
              type="text"
              name="name"
              id="name"
              placeholder="Full Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <i className="bx bx-lock"></i>
          </div>
          <div className="input-box">
            <label htmlFor="email">Email-Id</label>
            <input
              className="px-5"
              type="email"
              id="EmailId"
              name="email"
              placeholder="EmailId"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <i className="bx bx-lock"></i>
          </div>
          <div className="input-box">
            <label htmlFor="password">Password</label>
            <input
              className="px-5"
              type="password"
              placeholder="Password"
              name="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <button type="submit" className="btn">
            Register
          </button>
          <button 
            onClick={() => window.location.href = `http://localhost:3001/auth/google`}
            id="oauth">
            Register using Google
          </button>
        </form>
      </div>
      <ToastContainer /> 
    </div>
  );
}

export default SignUpPage; 
