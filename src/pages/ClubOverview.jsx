import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Github, Calendar, MessageSquare, Send, Users } from "lucide-react";
import { io } from "socket.io-client";
import axios from "axios";
const ENDPOINT = "http://localhost:3001";
let socket;
import API_BASE_URL from "../config";
function Clubs() {
  const { clubId } = useParams();
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [names, setNames] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();
  const storedName = localStorage.getItem("userName");
  useEffect(() => {
    socket = io(ENDPOINT, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.emit("joinRoom", clubId);

    socket.on("messageReceived", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, [clubId]);
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/clubs/${clubId}`)
      .then((response) => response.json())
      .then((data) => {
        setClub(data);
        console.log("club data:",data);
        setMembers(data.members);
        console.log(data.members)
        console.log("club members: ",members);
      })
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
  useEffect(() => {
  const fetchNames = async () => {
    try {
      console.log("I am changing");
      console.log("members to fetch names:",members)
      const response = await axios.post(
        `${API_BASE_URL}/api/club/getclubmembersnames`,
        { members },
        { withCredentials: true }
      );

      setNames(response.data.members);
      console.log("names:", response.data.members);
    } catch (error) {
      console.error("Error fetching names:", error);
    }
  };

  if (clubId) {
    fetchNames(); 
  }
}, [clubId,members]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const message = {
      sender: storedName,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString(),
    };

    socket.emit("sendMessage", { clubId, message });

    setMessages((prevMessages) => [...prevMessages, message]);
    setNewMessage("");

    fetch(`${API_BASE_URL}/api/club/${clubId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    }).catch((error) => console.error("Error sending message:", error));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-600 to-gray-100 flex">
      <div className="flex-1">
        {/* Club Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <Github className="h-10 w-10" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">
                    {club ? club.name : "Loading..."}
                  </h1>
                  <p className="text-blue-100">
                    {club ? club.description : "Loading club description..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events Section */}
        <div className="container mx-auto px-4 py-8 space-y-8">
          <section className="bg-white w-full rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Upcoming Events
              </h2>
              <button
                onClick={() => navigate("/createvent")}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
              >
                Create Event
              </button>
            </div>
            <div className="space-y-4">
              {Array.isArray(events) && events.length > 0 ? (
                events.map((event) => (
                  <div
                    key={event.id}
                    className="border-b last:border-b-0 pb-4 last:pb-0 hover:bg-gray-50 p-3 rounded-lg transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {event.date} • {event.time}
                        </p>
                        <p className="text-sm text-gray-600">
                          {event.location}
                        </p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {event.attendees} Registered
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">
                      {event.description}
                    </p>
                  </div>
                ))
              ) : (
                <p>No events available</p>
              )}
            </div>
          </section>
          {/* Club Members Section */}
          <section className="bg-white w-full rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 flex items-center mb-6">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              Club Members
            </h2>
            <div
              className="space-y-3"
              style={{
                maxHeight: "300px", 
                overflowY: "auto", 
              }}
            >
              {Array.isArray(names) && names.length > 0 ? (
                names.map((name) => (
                  <div
                    key={name._id}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm hover:bg-gray-100"
                  >
                    <div>
                      <p className="text-gray-800 font-medium">{name.name}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No members found</p>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Chat Section */}
      <div className="w-96 bg-white shadow-md border-l border-gray-200 flex flex-col">
        <div className="p-4 bg-blue-600 text-white flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Discussions
          </h2>
        </div>

        {/* Chat Messages */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-3"
          style={{ maxHeight: "700px" }}
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
                  className={`max-w-sm p-3 rounded-lg ${
                    message.sender === storedName
                      ? "bg-blue-100"
                      : "bg-gray-100"
                  } shadow`}
                >
                  <p className="text-xl font-semibold text-blue-900">
                    {message.sender === storedName ? "You" : message.sender}
                  </p>
                  <p className="text-sm text-gray-800">{message.text}</p>
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

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <input
              type="text"
              className="flex-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              onClick={handleSendMessage}
              className="ml-3 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Clubs;
