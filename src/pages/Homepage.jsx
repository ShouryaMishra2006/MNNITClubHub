import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { motion } from 'framer-motion'; // For animations
import Spinner from '../components/Spinner'; // Custom spinner component

const HomePage = () => {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  const [clubs, setClubs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Authentication check
    axios.get('http://localhost:3001/')
      .then(result => {
        if (result.data !== 'Success') {
          navigate('/LoginUser');
        }
      })
      .catch(err => console.error(err));

    // Fetch data for clubs and events
    Promise.all([
      axios.get('http://localhost:3001/api/clubs'),
      axios.get('http://localhost:3001/api/events')
    ])
      .then(([clubsResponse, eventsResponse]) => {
        if (Array.isArray(clubsResponse.data.clubs)) {
          setClubs(clubsResponse.data.clubs);
        } else {
          setClubs([]); 
        }
        console.log(eventsResponse)
        if (Array.isArray(eventsResponse.data.clubs)) {
          setUpcomingEvents(eventsResponse.data.clubs);
        } else {
          console.log("error in fetching events")
          setUpcomingEvents([]); 
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return <Spinner />; // Show a spinner while loading
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-800 to-gray-900 text-gray-100">
      <div className="bg-[url('assets/icon.webp')] bg-cover bg-center w-full h-[800px]">
        <div className="bg-black/70">
          <Navbar />
          <main className="flex-grow p-8">
            <section className="text-center mb-16">
              <motion.h1
                className="text-5xl font-extrabold text-sky-400 mb-4"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Welcome to MNNITClubHub
              </motion.h1>
              <motion.p
                className="text-xl text-white p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Connect with clubs, manage events, and track your journey!
              </motion.p>
            </section>

            <section className="mt-12">
              <h2 className="text-3xl font-semibold text-center text-sky-400 mb-6">
                College Clubs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {clubs.map((club, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-800 p-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
                    whileHover={{ scale: 1.1 }}
                  >
                    <h3 className="text-xl font-bold text-sky-400 mb-2">{club.name}</h3>
                    <p className="text-gray-300 mb-4">{club.description}</p>
                    <button className="bg-sky-700 text-gray-100 px-4 py-2 rounded hover:bg-sky-500 transition-all">
                      Join Club
                    </button>
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-3xl font-semibold text-center text-sky-400 mb-6">
                Upcoming Events
              </h2>
              <motion.div
                className="bg-gray-800 shadow-md rounded-lg p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <table className="min-w-full text-left">
                  <thead>
                    <tr>
                      <th className="border-b-2 border-sky-700 p-2 text-gray-200">Event</th>
                      <th className="border-b-2 border-sky-700 p-2 text-gray-200">Date</th>
                      <th className="border-b-2 border-sky-700 p-2 text-gray-200">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingEvents.map((event, index) => (
                      <tr key={index} className="border-b border-gray-600">
                        <td className="p-2 text-gray-300">{event.title}</td>
                        <td className="p-2 text-gray-300">{event.date}</td>
                        <td className="p-2 text-gray-300">{event.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            </section>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
