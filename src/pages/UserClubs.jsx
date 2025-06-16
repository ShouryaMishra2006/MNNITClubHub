import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useClub } from "../contexts/clubcontext";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";
import { motion } from "framer-motion";
import API_BASE_URL from "../config";

const HomePage = () => {
  const { user } = useParams();
  const [userName, setUserName] = useState("");
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState("dark");

  const { setClubId } = useClub();
  const navigate = useNavigate();
  const vantaEffect = useRef(null);
  const vantaContainer = useRef(null);
  const storedName = localStorage.getItem("userName");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") setTheme("light");
    else setTheme("dark");
  }, []);

  useEffect(() => {
    setUserName(storedName);
    axios
      .get(`${API_BASE_URL}/api/yourclubs?username=${storedName}`)
      .then((response) => {
        setClubs(response.data.clubs);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch clubs");
        setLoading(false);
      });
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
      color: 0x0077ff, // blue theme color
    });

    return () => {
      if (vantaEffect.current) vantaEffect.current.destroy();
    };
  }, []);

  const HandleClubs = (clubId) => {
    setClubId(clubId);
    navigate(`/ClubOverview/${clubId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div
      className={`min-h-screen min-w-full flex flex-col ${
        theme === "dark" ? "bg-gray-900/70 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      
          <div className="w-full h-[800px]">
            <nav
              className={`${
                 "bg-blue-700 text-white" 
              } p-4 flex justify-between top-0 sticky`}
            >
              <h1 className="text-xl font-bold">MNNITClubHub</h1>
              <div className="flex justify-between">
                <button
                  onClick={() => console.log("user profile")}
                  className="px-6 flex items-center space-x-2"
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span>{userName || "User"}</span>
                </button>
              </div>
            </nav>

            <main className="flex-grow p-8 w-full">
              <section className="mt-12">
                <h2
                  className={`text-3xl font-semibold text-center mb-6 ${
                    theme === "dark" ? "text-blue-400" : "text-blue-700"
                  }`}
                >
                  YOUR CLUBS
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {clubs.map((club, index) => (
                    <motion.div
                      key={index}
                      className={`p-6 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-xl hover:opacity-90 relative overflow-hidden ${
                        theme === "dark"
                          ? "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"
                          : "bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {club.imageUrl && (
                        <img
                          src={club.imageUrl}
                          alt={`${club.name} Image`}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}

                      <h3 className="text-3xl font-bold mb-3 tracking-wide relative z-10">
                        {club.name}
                        <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-600 blur-2xl opacity-30 rounded-lg z-[-1]"></span>
                      </h3>

                      <p className="mb-4">{club.description}</p>
                      <h3 className="py-2 px-1">Members : {club.memberCount}</h3>

                      <button
                        onClick={() => HandleClubs(club._id)}
                        className={`text-white px-6 py-3 rounded-lg shadow-md focus:ring-4 transition-all transform hover:scale-105 relative z-10 ${
                          theme === "dark"
                            ? "bg-blue-700 hover:bg-blue-500 focus:ring-blue-300"
                            : "bg-blue-600 hover:bg-blue-400 focus:ring-blue-200"
                        }`}
                      >
                        See Club Discussions
                      </button>

                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-pink-500 to-blue-600 opacity-10"></div>
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
  );
};

export default HomePage;
