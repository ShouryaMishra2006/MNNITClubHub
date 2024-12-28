import React, { useState, useEffect ,useRef}  from "react";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import Footer from "../components/Footer";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import { useClub } from "../contexts/clubcontext";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";
const HomePage = () => {
  const [userName, setUserName] = useState("");
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {setClubId}=useClub()
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

  const HandleClubs = (clubId) => {
    setClubId(clubId);
    console.log("Navigating to club discussions");
    navigate(`/ClubUser/${clubId}`);
  };
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName); 
    axios
        .get(`http://localhost:3001/api/joinedclubs?username=${storedName}`)
        .then(response => {
          setClubs(response.data.joinedClubs);
          setLoading(false);
        })
        .catch(err => {
          setError(`${err}`);
          setLoading(false);
        });
        console.log(clubs)
        console.log(error)
  }, []);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  
  const EditProfile=()=>{
    console.log("user profile")
  }

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
    <div className="min-h-screen min-w-full flex flex-col bg-gray-900 text-gray-100">
      <div id="vanta-bg" className="bg-[url('assets/icon.webp')] bg-cover bg-center w-full h-[800px]">
        <div className="bg-black/70">
          <div className="bg-cover bg-center w-full h-[800px]">
            <nav className="bg-sky-900 text-white p-4 flex justify-between">
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
                <h2 className="text-3xl font-semibold text-center text-sky-400 mb-6">
                  Clubs You are a Part of 
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {clubs.map((club, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 p-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
                    >
                      <h3 className="text-xl font-bold text-sky-400 mb-2">
                        {club.name}
                      </h3>
                      <p className="text-gray-300 mb-4">{club.description}</p>
                      <button
                        className="bg-sky-700 text-gray-100 px-4 py-2 rounded hover:bg-sky-500"
                        onClick={() => HandleClubs(club._id)}
                      >
                        Join Discussions
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </main>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
