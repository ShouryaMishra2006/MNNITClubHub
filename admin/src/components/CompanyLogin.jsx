import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../context/CompanyContext';
import API_BASE_URL from "../config";
function CompanyLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { setCompany } = useCompany();
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch(`${API_BASE_URL}/api/companies/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    if (response.ok) {
      setCompany(data.company); 
      navigate('/dashboard');   
    } else {
      alert(data.message || 'Login failed');
    }
  };

  return (
    <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Company Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="input" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="input" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full">Login</button>
      </form>
    </div>
  );
}

export default CompanyLogin;
