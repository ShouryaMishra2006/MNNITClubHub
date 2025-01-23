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
const HomePage = () => {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  const [clubs, setClubs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const vantaEffect = useRef(null);
  const vantaContainer = useRef(null);

  const initializeVanta = () => {
    if (vantaEffect.current) {
      vantaEffect.current.destroy();
    }
    vantaEffect.current = NET({
      el: "#vanta-bg",
      THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      backgroundColor: 0x111111,
      color: 0xff6600,
    });
  };

  useEffect(() => {
    initializeVanta();

    // Reinitialize on navigation back or focus
    window.addEventListener("focus", initializeVanta);
    if (vantaContainer.current) {
      vantaContainer.current.addEventListener("mouseenter", initializeVanta);
    }
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
      window.removeEventListener("focus", initializeVanta);
      if (vantaContainer.current) {
        vantaContainer.current.removeEventListener(
          "mouseenter",
          initializeVanta
        );
      }
    };
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3001/")
      .then((result) => {
        if (result.data !== "Success") {
          navigate("/LoginUser");
        }
      })
      .catch((err) => console.error(err));
    Promise.all([
      axios.get("http://localhost:3001/api/clubs"),
      axios.get("http://localhost:3001/api/events"),
    ])
      .then(([clubsResponse, eventsResponse]) => {
        if (Array.isArray(clubsResponse.data.clubs)) {
          setClubs(clubsResponse.data.clubs);
        } else {
          setClubs([]);
        }
        if (Array.isArray(eventsResponse.data.clubs)) {
          setUpcomingEvents(eventsResponse.data.clubs);
        } else {
          setUpcomingEvents([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-500 via-purple-800 to-purple-400 text-gray-100">
      {/* Static Navbar */}
      <Spotlight>
        <div className="fixed top-0 left-0 w-full z-50">
          <Navbar />
        </div>
      </Spotlight>

      {/* Main Content */}

      <main
        ref={vantaContainer}
        id="vanta-bg"
        className=" flex-grow pt-[4rem] pb-[4rem] p-8  "
      >
        {/* Hero Section */}
        <Spotlight>
          <section className="text-center mb-16 mt-20 ">
            <motion.h1
              className="text-5xl font-extrabold text-purple-400 mb-4 "
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Welcome to MNNITClubHub
            </motion.h1>
            <motion.p
              className="text-xl text-gray-300 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Connect with clubs, manage events, and track your journey!
            </motion.p>
          </section>

          {/* Clubs Section */}
          <section className="mt-12">
            <h2 className="text-3xl font-semibold text-center text-purple-300 mb-6">
              COLLEGE CLUBS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {clubs.map((club, index) => (
                  <motion.div
                    key={index}
                    className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 p-6 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-xl hover:opacity-90 relative overflow-hidden"
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

                    {/* Glow Effect on Club Name */}
                    <h3 className="text-3xl font-bold text-purple-100 mb-3 tracking-wide relative z-10">
                      {club.name}
                      <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 blur-2xl opacity-30 rounded-lg z-[-1]"></span>
                    </h3>

                    {/* Club Description */}
                    <p className="text-gray-100 mb-4">{club.description}</p>

                    {/* Join Club Button */}
                    <button className="bg-purple-700 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-500 hover:shadow-xl focus:ring-4 focus:ring-purple-300 transition-all transform hover:scale-105 relative z-10">
                      Join Club
                    </button>

                    {/* Decorative Element */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-pink-500 to-purple-600 opacity-10"></div>
                  </motion.div>
              ))}
            </div>
          </section>
        </Spotlight>
      </main>

      {/* Static Footer */}
      <div className="fixed bottom-0 left-0 w-full z-50">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
