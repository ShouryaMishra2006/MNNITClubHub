import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { motion } from "framer-motion";
import Spinner from "../components/Spinner";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";
import Spotlight from "../components/Spotlight";
import API_BASE_URL from "../config";

const HomePage = () => {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  const [clubs, setClubs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const vantaEffect = useRef(null);
  const vantaContainer = useRef(null);

  
  useEffect(() => {
    axios.get(`${API_BASE_URL}/`).then((result) => {
      if (result.data !== "Success") navigate("/LoginUser");
    });
    Promise.all([
      axios.get(`${API_BASE_URL}/api/clubs`),
      axios.get(`${API_BASE_URL}/api/events`),
    ])
      .then(([clubsRes, eventsRes]) => {
        setClubs(clubsRes.data.clubs || []);
        setUpcomingEvents(eventsRes.data.clubs || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [navigate]);

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen flex flex-col bg-blue-400 from-blue-800 via-blue-900 to-white-900 text-white">
      <Spotlight>
        <div className="fixed top-0 left-0 w-full z-50">
          <Navbar />
        </div>
      </Spotlight>

      <main id="vanta-bg" className="flex-grow pt-[4rem] pb-[4rem] p-8">
          {/* Hero Section */}
          <section className="text-center mb-16 mt-20">
            <motion.h1
              className="text-5xl font-extrabold text-blue-900 mb-4"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Welcome to MNNITClubHub
            </motion.h1>
            <motion.p
              className="text-xl text-blue-900 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Connect with clubs, manage events, and track your journey!
            </motion.p>
          </section>

          {/* Clubs Section */}
          <section className="mt-12">
            <h2 className="text-3xl font-semibold text-center text-blue-900 mb-6">
              COLLEGE CLUBS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {clubs.map((club, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 p-6 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-xl hover:opacity-95 relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Club Image */}
                  {club.imageUrl && (
                    <img
                      src={club.imageUrl}
                      alt={`${club.name} Image`}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}

                  {/* Glow Club Name */}
                  <h3 className="text-2xl font-bold text-blue-100 mb-3 relative z-10">
                    {club.name}
                    <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 blur-2xl opacity-30 rounded-lg z-[-1]"></span>
                  </h3>

                  {/* Club Description */}
                  <p className="text-blue-100 mb-4">{club.description}</p>

                  {/* Join Club Button */}
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-500 focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105">
                    Join Club
                  </button>

                  {/* Decorative Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 opacity-10"></div>
                </motion.div>
              ))}
            </div>
          </section>
      
      </main>

      <div className="fixed bottom-0 left-0 w-full z-50">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
