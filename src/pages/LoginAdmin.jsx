import React from "react";
import "../style/SignUp.css";
import AdminDashboard from "../AdminDashboard";
import { useNavigate } from "react-router-dom";

function SingnUpPage() {
  const navigate = useNavigate();
  const handleDasboard = (event) => {
    event.preventDefault();
    navigate("/admin-dashboard"); 
  };
  return (
    <div className="bg">
      <div className="wrapper">
        <form onSubmit={handleDasboard}>
          <h1>Login as Admin</h1>

          <div className="input-box">
            <label for="EmailId">Email-Id</label>
            <input className="px-5" type="text" id="EmailId " placeholder="EmailId " />
            <i className="bx bx-lock"></i>
          </div>
          <div className="input-box">
            <label for="password">Password</label>
            <input className="px-5"type="password" placeholder="Password " id="password" />
          </div>
          <div className="input"></div>
          <button type="submit" className="btn">
            Login
          </button>
          <button id="oauth" className="p-2">
            <a href="/oauth">Login with Google</a>
          </button>
          <div className="text-sm px-2">
            <p>Not Registered?</p>
            <button className="text-sky-900"id="register" >Click here</button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default SingnUpPage;
