import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from "../config";
function CompanySignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', contact: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const strongPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (!emailRegex.test(form.email)) {
      errs.email = 'Invalid email format';
    }

    if (!strongPassword.test(form.password)) {
      errs.password =
        'Password must be at least 8 characters long, include one letter, one number, and one special character';
    }

    if (!form.contact || form.contact.length < 8) {
      errs.contact = 'Enter a valid contact number';
    }

    if (!form.name.trim()) {
      errs.name = 'Company name is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await axios.post(`${API_BASE_URL}/api/companies/register`, {
        name: form.name,
        email: form.email,
        contactNumber: form.contact,
        password: form.password,
      });

      if (res.status === 201) {
        navigate('/login');
      }
    } catch (err) {
      console.error('Signup failed:', err);
      setApiError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 max-w-xl">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-xl ">
        <h2 className="text-4xl font-bold mb-6 text-center max-w-xl">Company Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4 ">
          <div>
            <input
              name="name"
              type="text"
              placeholder="Company Name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <input
              name="contact"
              type="text"
              placeholder="Contact Number"
              value={form.contact}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
            {errors.contact && <p className="text-red-500 text-sm">{errors.contact}</p>}
          </div>

          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          {apiError && <p className="text-red-600 text-sm">{apiError}</p>}

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already registered?{' '}
          <span onClick={() => navigate('/login')} className="text-blue-500 cursor-pointer hover:underline">
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default CompanySignup;
