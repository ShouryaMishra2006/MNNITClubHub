import React, { useState, useEffect } from "react";
import { Github, Calendar, MessageSquare, Send } from "lucide-react";
import { useParams } from "react-router-dom";

function Clubs() {
  const { clubId } = useParams();
  const [isJoined, setIsJoined] = useState(false);
  const [events, setEvents] = useState([]);
  const [club, setClub] = useState({});
  const [messages, setMessages] = useState([]); // State for chat messages
  const [newMessage, setNewMessage] = useState(""); // Input for new message

  useEffect(() => {
    // Fetch club details
    fetch(`http://localhost:3001/api/clubs/${clubId}`)
      .then((response) => response.json())
      .then((data) => setClub(data))
      .catch((error) => console.error("Error fetching club details:", error));

    // Fetch events
    fetch(`http://localhost:3001/api/clubs/${clubId}/events`)
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));

    // Fetch initial messages (replace with real-time WebSocket logic)
    fetch(`http://localhost:3001/api/club/${clubId}/messages`)
      .then((response) => response.json())
      .then((data) => setMessages(data))
      .catch((error) => console.error("Error fetching messages:", error));
  }, [clubId]);

  // Handle sending new messages
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Send the message to the backend and update state
      const message = {
        sender: "You",
        text: newMessage,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages([...messages, message]);
      setNewMessage("");

      // Simulate sending message to backend
      // fetch('http://localhost:3001/api/club/messages', { method: 'POST', body: JSON.stringify(message) });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-600 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r flex flex-col  from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="container flex flex-col mx-auto px-4 py-8">
          <div className="flex  items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                <Github className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{club.name}</h1>
                <p className="text-blue-100">{club.description}</p>
              </div>
            </div>
            <button
              onClick={() => setIsJoined(!isJoined)}
              className="px-6 py-2 rounded-full font-semibold transition-all transform hover:scale-105 bg-red-500 hover:bg-red-600"
            >
              {isJoined ? "Leave Club" : "Join Club"}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Events Section */}
        <section className="bg-white w-full rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
          <div className="flex  justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Upcoming Events
            </h2>
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
                      <p className="text-sm text-gray-600">{event.location}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {event.attendees} Registered
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">
                    {event.description}
                  </p>
                  <button className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
                    Register
                    <span className="ml-1">→</span>
                  </button>
                </div>
              ))
            ) : (
              <p>No events available</p>
            )}
          </div>
        </section>

        {/* Discussions Section */}
        <div className="w-full lg:w-96 bg-white shadow-md border-l border-gray-200 flex flex-col">
          <div className="p-4 bg-blue-600 text-white flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Discussions
            </h2>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === "You" ? "justify-end" : ""
                  }`}
                >
                  <div
                    className={`max-w-sm p-3 rounded-lg ${
                      message.sender === "You" ? "bg-blue-100" : "bg-gray-100"
                    } shadow`}
                  >
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
    </div>
  );
}

export default Clubs;
