import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useClub } from '../contexts/clubcontext';
function CreateEvent() {
  const [club, setClub] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [attendees, setAttendees] = useState(0);
  const navigate = useNavigate();
  const {clubId}=useClub();
  const handleSubmit = (event) => {
    event.preventDefault();
    const eventData = { club, title, date, time, location, description, attendees };
    console.log(clubId)
    axios.post('http://localhost:3001/api/createEvent', eventData)
      .then(response => {
        if (response.data.success) {
          toast.success('Event created successfully!', { autoClose: 5173});
          setClub('');
          setTitle('');
          setDate('');
          setTime('');
          setLocation('');
          setDescription('');
          setAttendees(0);
          navigate(`/ClubOverview/${clubId}`)
        } else {
          toast.error('Failed to create event: ' + response.data.message, { autoClose: 3000 });
        }
      })
      .catch(err => {
        toast.error('Error creating event', { autoClose: 3000 });
      });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-gray-500 p-8 shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Create Event</h2>
      
      <label className="block mb-2">
        Club Name:
        <input
          type="text"
          value={club}
          onChange={(e) => setClub(e.target.value)}
          required
          className="border rounded w-full p-2 mt-1"
        />
      </label>
      
      <label className="block mb-2">
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border rounded w-full p-2 mt-1"
        />
      </label>
      
      <label className="block mb-2">
        Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="border rounded w-full p-2 mt-1"
        />
      </label>
      
      <label className="block mb-2">
        Time:
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="border rounded w-full p-2 mt-1"
        />
      </label>
      
      <label className="block mb-2">
        Location:
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="border rounded w-full p-2 mt-1"
        />
      </label>
      
      <label className="block mb-2">
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded w-full p-2 mt-1"
        />
      </label>
      
      <label className="block mb-2">
        Attendees:
        <input
          type="number"
          value={attendees}
          onChange={(e) => setAttendees(e.target.value)}
          className="border rounded w-full p-2 mt-1"
        />
      </label>

      <button type="submit" className="w-full mt-4 p-2 bg-blue-600 text-white font-semibold rounded">
        Create Event
      </button>
    </form>
  );
}

export default CreateEvent;
