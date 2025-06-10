// AdminDashboard.js
// AdminDashboard.js
import React from 'react';
import '../src/style/AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li><a href="#users">Manage Users</a></li>
          <li><a href="#settings">Settings</a></li>
          <li><a href="#reports">Reports</a></li>
        </ul>
      </aside>
      <main className="main-content">
        <header>
          <h1>Welcome to the Admin Dashboard</h1>
        </header>
        <section className="grid-container">
          <div className="card">
            <h3>Users Overview</h3>
            <p>Total Users: 150</p>
          </div>
          <div className="card">
            <h3>Recent Activity</h3>
            <p>New Sign-Ups: 10</p>
          </div>
          <div className="card">
            <h3>Reports</h3>
            <p>Sales Report: View</p>
          </div>
          <div className="card">
            <h3>Settings</h3>
            <p>Manage Account Settings</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;