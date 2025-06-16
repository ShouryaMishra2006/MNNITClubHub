import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useClub } from '../contexts/clubcontext';
import 'react-toastify/dist/ReactToastify.css';
import API_BASE_URL from "../config";

function CreateEvent() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState('light');
  const { clubId } = useClub();
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setTheme(savedTheme === "dark" ? "dark" : "light");
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const eventData = {
      clubId,
      title,
      date,
      time,
      location,
      description
    };

    axios.post(`${API_BASE_URL}/api/createEvent`, eventData)
      .then(response => {
        if (response.data.success) {
          toast.success('Event created successfully!', { autoClose: 3000 });
          setTitle('');
          setDate('');
          setTime('');
          setLocation('');
          setDescription('');
          navigate(`/ClubOverview/${clubId}`);
        } else {
          toast.error('Failed to create event: ' + response.data.message, { autoClose: 3000 });
        }
      })
      .catch(() => {
        toast.error('Error creating event', { autoClose: 3000 });
      });
  };

  return (
    <div className={`flex items-center justify-center min-h-screen max-w-full ${
      theme === "dark" ? "bg-black text-white" : "bg-white text-black"
    }`}>
      <div className="shadow-xl rounded-lg p-8 w-full max-w-md border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-blue-600">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-800 dark:text-blue-100">
          Create Event
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-indigo-700 dark:text-indigo-200 font-semibold mb-2">
              Event Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength="40"
              placeholder="Event Title"
              className="w-full px-4 py-2 border text-black border-indigo-300 dark:border-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="date" className="block text-indigo-700 dark:text-indigo-200 font-semibold mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-4 py-2 border text-black border-indigo-300 dark:border-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="time" className="block text-indigo-700 dark:text-indigo-200 font-semibold mb-2">
              Time
            </label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full px-4 py-2 border text-black border-indigo-300 dark:border-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="location" className="block text-indigo-700 dark:text-indigo-200 font-semibold mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              maxLength="40"
              placeholder="Event Location"
              className="w-full px-4 py-2 border text-black border-indigo-300 dark:border-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-indigo-700 dark:text-indigo-200 font-semibold mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              maxLength="100"
              placeholder="Event Description"
              className="w-full px-4 py-2 border text-black border-indigo-300 dark:border-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-200 text-blue-600 font-bold py-2 px-4 rounded-md hover:bg-blue-300 transition duration-300"
          >
            Create Event
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default CreateEvent;
