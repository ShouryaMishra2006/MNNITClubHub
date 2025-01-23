import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import Footer from "../components/Footer";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useClub } from "../contexts/clubcontext";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";
import { motion } from "framer-motion";
const HomePage = () => {
  const {user} = useParams()
  const [userName, setUserName] = useState("");
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setClubId } = useClub();
  const navigate = useNavigate();
  const vantaEffect = useRef(null);
  const vantaContainer = useRef(null);
  const storedName = localStorage.getItem("userName");
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
    return () => {
      if (vantaEffect.current) vantaEffect.current.destroy();
    };
  }, []);

  const HandleClubs = (clubId) => {
    setClubId(clubId);
    console.log("Navigating to club discussions");
    navigate(`/ClubOverview/${clubId}`);
  };
  useEffect(() => {
    setUserName(storedName)
    axios
      .get(`http://localhost:3001/api/yourclubs?username=${storedName}`)
      .then((response) => {
        setClubs(response.data.clubs);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch clubs");
        setLoading(false);
      });
  }, []);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const EditProfile = () => {
    console.log("user profile");
  };

  const upcomingEvents = [
    {
      title: "Robotics Workshop",
      date: "2024-11-10",
      time: "10:00 AM",
    },
    {
      title: "Coding Hackathon",
      date: "2024-11-15",
      time: "9:00 AM",
    },
    {
      title: "Aero Club Open House",
      date: "2024-11-20",
      time: "1:00 PM",
    },
  ];

  return (
    <div className="min-h-screen min-w-full flex flex-col bg-gray-900/50 text-gray-100">
      <div
        id="vanta-bg"
        className="bg-[url('assets/icon.webp')] bg-cover bg-center w-full h-[800px]"
      >
        <div className="bg-black/70">
          <div className="bg-cover bg-center w-full h-[800px]">
            <nav className="bg-purple-900 text-white p-4 flex justify-between">
              <h1 className="text-xl font-bold">MNNITClubHub</h1>
              <div className="flex justify-between">
                <button
                  onClick={EditProfile}
                  className="px-6 flex items-center space-x-2"
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span>{userName || "User"}</span>
                </button>
              </div>
            </nav>
            <main className="flex-grow p-8 w-full">
              <section className="mt-12">
                <h2 className="text-3xl font-semibold text-center text-purple-400 mb-6">
                  YOUR CLUBS
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
                                    <h3 className="text-ellipsis text-gray-100 mb:4 py-2 px-1">Members : {club.memberCount}</h3>
                                    {/* Join Club Button */}
                                    <button onClick={() => HandleClubs(club._id)} className="bg-purple-700 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-500 hover:shadow-xl focus:ring-4 focus:ring-purple-300 transition-all transform hover:scale-105 relative z-10">
                                      See Club Discussions
                                    </button>
                
                                    {/* Decorative Element */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-pink-500 to-purple-600 opacity-10"></div>
                                  </motion.div>
                              ))}
                            </div>
                
              </section>
            </main>
          </div>
          <div className="fixed bottom-0 left-0 w-full z-50">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
