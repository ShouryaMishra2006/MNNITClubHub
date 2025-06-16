import React, { useState, useEffect } from "react";
import { Github, Calendar, MessageSquare, Send } from "lucide-react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import API_BASE_URL from "../config";

const ENDPOINT = API_BASE_URL;
let socket;

function Clubs() {
  const { clubId } = useParams();
  const storedName = localStorage.getItem("userName");

  const [club, setClub] = useState({});
  const [events, setEvents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userRegisteredEvents, setUserRegisteredEvents] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  // Register for Event
  const handleRegister = async (eventId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/events/${eventId}/${storedName}/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: storedName }),
        }
      );
      const data = await response.json();
      setUserRegisteredEvents(data.RegisteredEvents);

      alert(`Registered for event: ${data.message}`);
    } catch (error) {
      console.error("Registration error:", error.message);
    }
  };

  // Fetch Club Data
  useEffect(() => {
    const savedMode = localStorage.getItem("theme");
    if (savedMode === "dark") {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
    fetch(`${API_BASE_URL}/api/clubs/${clubId}`)
      .then((res) => res.json())
      .then((data) => setClub(data));

    fetch(`${API_BASE_URL}/api/clubs/${clubId}/events`)
      .then((res) => res.json())
      .then((data) => setEvents(data));

    fetch(`${API_BASE_URL}/api/club/${clubId}/messages`)
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, [clubId]);

  // WebSocket Messages
  useEffect(() => {
    socket = io(ENDPOINT, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.emit("joinRoom", clubId);
    socket.on("messageReceived", (msg) =>
      setMessages((prev) => [...prev, msg])
    );

    return () => socket.disconnect();
  }, [clubId]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      sender: storedName,
      text: newMessage,
      timestamp: new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };

    setMessages([...messages, message]);
    setNewMessage("");
    socket.emit("sendMessage", { clubId, newMessage });

    fetch(`${API_BASE_URL}/api/club/${clubId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });
  };

  return (
    <div
      className={`min-h-screen min-w-full flex flex-col  ${ darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}
    >
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white p-6 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
            <Github className="h-10 w-10" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{club.name}</h1>
            <p className="text-white text-lg">President: {club.president}</p>
            <p className="text-blue-100">{club.description}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white-200 rounded-xl">

        {/* Events Section */}
        <section className="lg:col-span-7 rounded-xl shadow p-6 max-w-5xl bg-white">

          <h2 className="text-xl text-black font-bold flex items-center mb-4">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Upcoming Events
          </h2>
          <div className="grid sm:grid-cols-2 text-black bg-white rounded-xl gap-6 max-w-xl">
            {events.length ? (
              events.map((event) => (
                <div
                  key={event._id}
                  className={`p-4 border  rounded-lg hover:shadow-md `}
                >
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-sm">
                    {event.date} • {event.time}
                  </p>
                  <p className="text-sm">{event.location}</p>
                  <p className="text-sm mt-2">{event.description}</p>
                  <button
                    onClick={() => handleRegister(event._id)}
                    disabled={userRegisteredEvents.includes(event._id)}
                    className={`mt-2 text-sm font-medium ${
                      userRegisteredEvents.includes(event._id)
                        ? "text-green-500"
                        : "text-blue-500 hover:underline"
                    }`}
                  >
                    {userRegisteredEvents.includes(event._id)
                      ? "Registered"
                      : "Register"}
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No events available.</p>
            )}
          </div>
        </section>

        {/* Discussions Section */}
        <section className="lg:col-span-5 flex flex-col rounded-xl shadow p-6 bg-white max-w-3xl">

          <h2 className="text-xl font-bold flex items-center mb-4">
            <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
            Discussions
          </h2>
          <div
            className="flex-grow overflow-y-auto space-y-4 mb-4 pr-1"
            style={{ maxHeight: "500px" }}
          >
            {messages.length ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === storedName ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-xs break-words ${
                      msg.sender === storedName
                        ? "bg-blue-500 text-white"
                        : 
                      "bg-blue-500 text-white"
                        
                    }`}
                  >
                    <p className="font-semibold">
                      {msg.sender === storedName
                        ? "You"
                        : msg.sender === club.username
                        ? "Admin"
                        : msg.sender}
                    </p>
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs text-right text-white">
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No messages yet.</p>
            )}
          </div>
          <div className="flex">
            <input
              type="text"
              className="flex-1 border px-3 py-2 rounded-l-lg"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              onClick={handleSendMessage}
              className="px-4 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Clubs;
