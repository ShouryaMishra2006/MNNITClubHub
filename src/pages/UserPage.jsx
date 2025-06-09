import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";
import Spotlight from "../components/Spotlight"
import Typewriter from "../components/Typewriter"
import { motion } from "framer-motion";
import JobBoard from "./JobBoard";
const HomePage = () => {
  const { user } = useParams();
  const [userName, setUserName] = useState("");
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
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

  useEffect(() => {
    setUserName(user)
    localStorage.setItem("userName",user);
    axios
      .get("http://localhost:3001/api/clubs", { withCredentials: true })
      .then((response) => {
        setClubs(response.data.clubs);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch clubs");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-500">
        {error}
      </div>
    );
  }
  const HandleJoin=(club)=>{
    console.log("Joining club:", club);
    console.log(club._id)
    console.log(userName)
    fetch("http://localhost:3001/api/club/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName:userName,
        clubId: club._id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Error:", data.error);
        } else {
          console.log("Successfully joined club:", data);
          alert(`You have joined the club: ${club.name}`);
        }
      })
      .catch((error) => console.error("Error joining club:", error));
  }
  const HandleClubs = () => navigate("/UserClubs");
  const HandleCreate = () => navigate("/createClub");
  const HandleUser = () => navigate("/Profile");
  const HandleJoinedClubs=()=>navigate("/JoinedClubs")
  const upcomingEvents = [
    { title: "Robotics Workshop", date: "2024-11-10", time: "10:00 AM" },
    { title: "Coding Hackathon", date: "2024-11-15", time: "9:00 AM" },
    { title: "Aero Club Open House", date: "2024-11-20", time: "1:00 PM" },
  ];
  const handleLogout = async () => {
    try {
      const response=fetch("http://localhost:3001/logout", {
        method: "GET",
        credentials: "include",
      })
        console.log(response)
        if(!response.ok) console.log(response)
        window.location.href = "/LoginUser"; 
    } catch (error) {
        console.error("Logout failed:", error);
    }
};

  return (
    <div className="h-screen w-full bg-gray-900/50 text-gray-100">
      <div id="vanta-bg" className=" bg-gray-900/100">
        <nav className="bg-purple-800/90 backdrop-blur-sm p-4 fixed w-full z-10">
          <div className="w-full flex justify-between items-center max-w-full mx-auto">
            <h1 className="text-2xl font-bold text-gray-100">MNNITClubHub</h1>
            <div className="flex space-x-4">
            <button onClick={HandleJoinedClubs} className="hover:underline">
                Joined Clubs
              </button>
              <button onClick={HandleClubs} className="hover:underline">
                Your Clubs
              </button>
              <button
                onClick={HandleCreate}
                className="hover:underline flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faPlusCircle} />
                <span>Create Club</span>
              </button>
              <button
                onClick={HandleUser}
                className="flex items-center space-x-2 hover:underline"
              >
                <FontAwesomeIcon icon={faUser} />
                <span>{userName || "User"}</span>
              </button>
              <button onClick={handleLogout} className="font-bold hover:underline">Logout</button>
            </div>
          </div>
        </nav>
        
        <div className="h-screen w-full flex flex-col justify-center items-center text-center bg-gray-800/70">
        <h1 className="text-4xl text-pretty text-gray-300 font-bold py-2">
          Hi, {userName} !
        </h1>
        <h1 className="text-ellipsis text-6xl font-extrabold text-purple-400 mb-4">
          Welcome to MNNITClubHub
        </h1>
        <p className="text-xl text-gray-300 mb-6">
          Connect with clubs, manage events, and track your journey!
        </p>
        </div>
      </div>
      <main className="max-w-full mx-auto p-6 ">
      <Spotlight>
        <section className="mt-12">
          <h2 className="text-4xl font-semibold text-purple-400 text-center mb-8">
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
                    <h3 className="text-ellipsis text-gray-100 mb:4 py-2 px-1">Members : {club.memberCount}</h3>
                    {/* Join Club Button */}
                    <button onClick={()=>HandleJoin(club)} className="bg-purple-700 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-500 hover:shadow-xl focus:ring-4 focus:ring-purple-300 transition-all transform hover:scale-105 relative z-10">
                      Join Club
                    </button>

                    {/* Decorative Element */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-pink-500 to-purple-600 opacity-10"></div>
                  </motion.div>
              ))}
            </div>
            
        </section>
        </Spotlight>
        <JobBoard/>
      </main>
      <div className="fixed bottom-0 left-0 w-full z-50">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;