import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";

const HomePage = () => {
  const [userName, setUserName] = useState("");
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const vantaEffect = useRef(null);

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
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
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

  return (
    <div className="h-screen w-full bg-gray-900/50 text-gray-100">
      <div id="vanta-bg" className=" bg-gray-900/60">
        <nav className="bg-gray-800/90 backdrop-blur-sm p-4 fixed w-full z-10">
          <div className="w-full flex justify-between items-center max-w-full mx-auto">
            <h1 className="text-2xl font-bold text-sky-400">MNNITClubHub</h1>
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
            </div>
          </div>
        </nav>
        <div className="h-screen w-full flex flex-col justify-center items-center text-center bg-gray-800/50">
          <h1 className="text-6xl font-extrabold text-sky-400 mb-4">
            Welcome to MNNITClubHub
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Connect with clubs, manage events, and track your journey!
          </p>
        </div>
      </div>
      <main className="max-w-full mx-auto p-6">
        <section className="mt-12">
          <h2 className="text-4xl font-semibold text-sky-400 text-center mb-8">
            College Clubs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clubs.map((club, index) => (
              <div
                key={index}
                className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform"
              >
                <h3 className="text-2xl font-bold text-sky-400">{club.name}</h3>
                <p className="text-gray-300 mb-4">{club.description}</p>
                <p className="text-gray-300 mb-4">Members: {club.memberCount}</p>
                <button onClick={()=>HandleJoin(club)} className="bg-sky-700 text-gray-100 px-4 py-2 rounded hover:bg-sky-500">
                  Join Club
                </button>
              </div>
            ))}
          </div>
        </section>
        <section className="mt-12">
          <h2 className="text-4xl font-semibold text-sky-400 text-center mb-8">
            Upcoming Events
          </h2>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <table className="min-w-full text-left">
              <thead>
                <tr>
                  <th className="p-2 border-b border-sky-700">Event</th>
                  <th className="p-2 border-b border-sky-700">Date</th>
                  <th className="p-2 border-b border-sky-700">Time</th>
                </tr>
              </thead>
              <tbody>
                {upcomingEvents.map((event, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="p-2">{event.title}</td>
                    <td className="p-2">{event.date}</td>
                    <td className="p-2">{event.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
