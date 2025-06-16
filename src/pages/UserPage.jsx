import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPlusCircle, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import API_BASE_URL from "../config";
import { motion } from "framer-motion";
import JobBoard from "./JobBoard";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom"; 
const HomePage = () => {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); 
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const { username } = useParams(); // ← extract the `:user` param

  useEffect(() => {
    if (username) {
      localStorage.setItem("userName", username); // optional
      console.log("Username from URL param:", username);
    }
  }, [user]);
  // Load user and theme from localStorage
  useEffect(() => {
    
    let storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");
    if(username){
      storedName=username
    }
    if (!user && storedName && storedEmail) {
      login({ name: storedName, email: storedEmail });
    }

    const savedMode = localStorage.getItem("theme");
    if (savedMode === "dark") {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/clubs`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setClubs(data.clubs);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch clubs");
        setLoading(false);
      });
  }, []);

  const handleJoin = (club) => {
    fetch(`${API_BASE_URL}/api/club/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName: user.name,
        clubId: club._id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) alert(data.error);
        else alert(`You have joined the club: ${club.name}`);
      })
      .catch(() => alert("Error joining club"));
  };

  const handleLogout = () => {
    logout();
    navigate("/LoginUser");
  };

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const themeClass = darkMode ? "dark" : "light";

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 bg-white dark:bg-gray-900 dark:text-white">
        {error}
      </div>
    );

  return (
    <div className={`min-h-screen min-w-full flex flex-col ${themeClass === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
      {/* Navbar */}
      <nav className="bg-white/80 dark:bg-gray-700/50 backdrop-blur-sm shadow-md fixed w-full z-20 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-blue-600 dark:text-blue-600 tracking-tight">
            MNNITClubHub
          </h1>
          <div className="flex gap-4 items-center font-medium">
            <button onClick={() => navigate("/JoinedClubs")} className="hover:text-blue-500 transition">Joined</button>
            <button onClick={() => navigate("/UserClubs")} className="hover:text-blue-500 transition">Your Clubs</button>
            <button onClick={() => navigate("/createClub")} className="flex items-center gap-1 hover:text-blue-500 transition">
              <FontAwesomeIcon icon={faPlusCircle} /> <span>Create</span>
            </button>
            <button className="flex items-center gap-1 hover:text-blue-500 transition">
              <FontAwesomeIcon icon={faUser} /> <span>{user?.name || username}</span>
            </button>
            <button onClick={toggleTheme} className="hover:text-blue-500 transition">
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
            </button>
            <button onClick={handleLogout} className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-500 transition">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow p-8 w-full">
        <section className="mt-12">
          <section className="pt-28 pb-16 text-center bg-gradient-to-b">
            <div className="relative inline-block">
              {/* Left spotlight */}
              <div className="absolute -left-[200px] -top-[100px] w-[400px] h-[400px] pointer-events-none z-0">
                <div
                  className={`w-full h-full opacity-30 blur-3xl ${
                    darkMode ? "bg-white" : "bg-black"
                  }`}
                  style={{
                    background: `radial-gradient(circle at top, ${
                      darkMode ? "white" : "black"
                    } 0%, transparent 70%)`,
                    clipPath: "polygon(0% 40%, 100% 0%, 100% 100%, 0% 100%)",
                    transform: "rotate(-55deg)",
                  }}
                ></div>
              </div>

              <h1 className="relative text-4xl sm:text-5xl font-bold text-blue-800 dark:text-blue-600 z-10">
                Hi, {user?.name || username} 👋
              </h1>
            </div>

            <h2 className="mt-4 text-2xl sm:text-3xl font-semibold">
              <span className="text-blue-700 dark:text-blue-400">
                Welcome to MNNITClubHub
              </span>
            </h2>
            <p className="mt-3 text-gray-700 dark:text-gray-400 max-w-xl mx-auto">
              Connect with clubs, manage events, and track your journey like
              never before!
            </p>
          </section>

          <h2 className="text-3xl font-semibold text-center text-blue-400 mb-6">
            COLLEGE CLUBS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clubs.map((club, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 p-6 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-xl hover:opacity-90 relative overflow-hidden"
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

                <h3 className="text-3xl font-bold text-purple-100 mb-3 tracking-wide relative z-10">
                  {club.name}
                  <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-600 blur-2xl opacity-30 rounded-lg z-[-1]"></span>
                </h3>

                <p className="text-gray-100 mb-4">{club.description}</p>

                <button
                  onClick={() => handleJoin(club)}
                  className="bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-500 hover:shadow-xl focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105 relative z-10"
                >
                  Join Club
                </button>

                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-pink-500 to-blue-600 opacity-10"></div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <JobBoard />

      <div className="fixed bottom-0 left-0 w-full z-50">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
