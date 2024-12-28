import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
function CreateClubPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [president, setPresident] = useState("");
  const [members, setMembers] = useState(0);
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    const username = localStorage.getItem("userName");
    axios.post('http://localhost:3001/api/createClub', { name, description, president , username,members },{withCredentials: true})
      .then(result => {
        if (result.data.success) {
          toast.success("Club created successfully!", {
            autoClose: 3000
          });
          navigate('/UserPage');  
        } else {
          toast.error("Failed to create club: " + result.data.message, {
            autoClose: 3000
          });
        }
      })
      .catch(err => {
        toast.error("Error creating club", {
          autoClose: 3000
        });
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-400 max-w-full">
      <div className="bg-gray shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Club</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Club Name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Club Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea
              name="description"
              id="description"
              placeholder="Description of the club"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              rows="4"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="president" className="block text-gray-700 font-semibold mb-2">President</label>
            <input
              type="text"
              name="president"
              id="president"
              placeholder="President's Name (optional)"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              onChange={(e) => setPresident(e.target.value)}
              value={president}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="members" className="block text-gray-700 font-semibold mb-2">Initial Members</label>
            <input
              type="number"
              name="members"
              id="members"
              placeholder="Number of Initial Members"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              onChange={(e) => setMembers(e.target.value)}
              value={members}
              min="0"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
            Create Club
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default CreateClubPage;
