import React, { useState, useEffect } from "react";
import { Github, Calendar, MessageSquare, Send } from "lucide-react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import API_BASE_URL from "../config";
const ENDPOINT = "http://localhost:3001";
let socket;
function Clubs() {
  const { clubId } = useParams();
  const [isJoined, setIsJoined] = useState(false);
  const [events, setEvents] = useState([]);
  const [club, setClub] = useState({});
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userRegisteredEvents, setuserRegisteredEvents] = useState([]);
  const storedName = localStorage.getItem("userName");
  const handleRegister = async (eventId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/events/${eventId}/${storedName}/register`,
        { method: "POST" ,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: storedName }), 
        },
        
      );
      console.log(response)
      if (!response.ok) {
        throw new Error(`Failed to register for event: ${response.statusText}`);
      }
      const data = await response.json();
      setuserRegisteredEvents(data.RegisteredEvents);
      console.log(userRegisteredEvents);
      alert(`Registered for event: ${data.message}`);
    } catch (error) {
      console.log(userRegisteredEvents)
      console.error("Error registering for event:", error.message);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT, {
      transports: ["websocket"],
      withCredentials: true,
    });
    socket.emit("joinRoom", clubId);
    socket.emit("messageReceived", newMessage);
    socket.emit("sendMessage", { clubId, newMessage });
    socket.on("messageReceived", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.disconnect(); 
    };
  }, [clubId, newMessage]);
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/clubs/${clubId}`)
      .then((response) => response.json())
      .then((data) => setClub(data))
      .catch((error) => console.error("Error fetching club details:", error));
    fetch(`${API_BASE_URL}/api/clubs/${clubId}/events`)
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));
    fetch(`${API_BASE_URL}/api/club/${clubId}/messages`)
      .then((response) => response.json())
      .then((data) => setMessages(data))
      .catch((error) => console.error("Error fetching messages:", error));
  }, [clubId]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
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
      fetch(`${API_BASE_URL}/api/club/${clubId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      }).catch((error) => console.error("Error sending message:", error));
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${club.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="min-h-screen flex flex-col bg-gray-50 "
    >
      {/* Header Section */}
      <header className="sticky top-0 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white shadow-lg">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
              <Github className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{club.name}</h1>
              <h2 className="text-xl font-semibold text-white my-3">
                President : {club.president}
              </h2>
              <p className="text-blue-100">{club.description}</p>
            </div>
          </div>
          
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Events Section */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Upcoming Events
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.length > 0 ? (
              events.map((event) => (
                <div
                  key={event.id}
                  className="p-4 border rounded-lg shadow hover:bg-gray-50 transition"
                >
                  <h3 className="font-semibold text-gray-800">{event.title}</h3>
                  <p className="text-sm text-gray-600">
                    {event.date} • {event.time}
                  </p>
                  <p className="text-sm text-gray-600">{event.location}</p>
                  <p className="text-sm text-gray-700 mt-2">
                    {event.description}
                  </p>
      
                  <button
                    onClick={() => handleRegister(event._id)}
                    disabled={userRegisteredEvents.includes(event._id)} 
                    className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {userRegisteredEvents.includes(event._id)
                      ? "Registered"
                      : "Register"}
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No events available</p>
            )}
          </div>
        </section>

        {/* Discussions Section */}
        <section className="lg:flex-row gap-6">
          <div className="w-full lg:w-3/4 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
              Discussions
            </h2>
            <div
              className="flex flex-col space-y-4 overflow-y-auto"
              style={{ maxHeight: "400px" }}
            >
              {messages.length > 0 ? (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.sender === storedName ? "justify-end" : ""
                    }`}
                  >
                    <div
                      className={`p-4 rounded-lg shadow ${
                        message.sender === storedName
                          ? "bg-blue-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <p className="font-semibold text-blue-900">
                        {message.sender === storedName
                          ? "You"
                          : message.sender === club.username
                          ? "Admin"
                          : message.sender}
                      </p>
                      <p className="text-gray-800">{message.text}</p>
                      <p className="text-xs text-gray-500 text-right">
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No messages yet</p>
              )}
            </div>
            <div className="flex items-center bg-white shadow rounded-lg p-2 ">
              <input
                type="text"
                className="flex-1 border rounded-lg px-4 py-2 "
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                onClick={handleSendMessage}
                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Clubs;
