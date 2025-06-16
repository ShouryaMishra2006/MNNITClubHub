import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_BASE_URL from "../config";

function CreateClubPage() {
  const { user } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [president, setPresident] = useState("");
  const [members, setMembers] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setTheme("dark");
    else setTheme("light");
  }, []);

  const handleUpload = () => {
    window.cloudinary.openUploadWidget(
      {
        cloud_name: "dphseqp11",
        upload_preset: "ml_default",
        sources: ["local", "url", "camera"],
        multiple: false,
        cropping: true,
        cropping_aspect_ratio: 1,
        max_file_size: 10000000,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setImageUrl(result.info.secure_url);
        }
      }
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const username = localStorage.getItem("userName");
    if (!imageUrl) {
      toast.error("Please upload an image before submitting.");
      return;
    }

    axios
      .post(
        `${API_BASE_URL}/api/createClub`,
        { name, description, president, username, members, imageUrl },
        { withCredentials: true }
      )
      .then((result) => {
        if (result.data.success) {
          toast.success("Club created successfully!", { autoClose: 3000 });
          navigate(`/UserPage/${username}`);
        } else {
          toast.error("Failed to create club: " + result.data.message, {
            autoClose: 3000,
          });
        }
      })
      .catch(() => {
        toast.error("Error creating club", { autoClose: 3000 });
      });
  };

  return (
    <div className={`flex items-center justify-center min-h-screen max-w-full ${
      theme === "dark" ? "bg-black text-white" : "bg-white text-black"
    }`}>
      <div className="shadow-xl rounded-lg p-8 w-full max-w-md border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-blue-600">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-800 dark:text-blue-100">
          Create Club
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-indigo-700 dark:text-indigo-200 font-semibold mb-2">
              Club Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              maxLength="30"
              placeholder="Club Name"
              className="w-full px-4 py-2 border text-black border-indigo-300 dark:border-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-indigo-700 dark:text-indigo-200 font-semibold mb-2">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              maxLength="100"
              placeholder="Description of the club"
              className="w-full px-4 py-2 border text-black border-indigo-300 dark:border-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              rows="4"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="president" className="block text-indigo-700 dark:text-indigo-200 font-semibold mb-2">
              President
            </label>
            <input
              type="text"
              name="president"
              id="president"
              maxLength="30"
              placeholder="President's Name (optional)"
              className="w-full px-4 py-2 border border-indigo-300 text-black dark:border-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setPresident(e.target.value)}
              value={president}
            />
          </div>

          <button
            onClick={(event) => {
              event.preventDefault();
              handleUpload();
            }}
            className="w-full mb-4 py-2 bg-blue-200 text-blue-600 font-semibold rounded-md hover:bg-blue-300 transition"
          >
            Upload Image
          </button>

          {imageUrl && (
            <div className="mb-4">
              <h3 className="text-blue-950 mb-2">Uploaded Image:</h3>
              <img src={imageUrl} alt="Uploaded Club" className="rounded-md w-40 h-auto mx-auto" />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-200 text-blue-600 font-bold py-2 px-4 rounded-md hover:bg-blue-300 transition duration-300"
          >
            Create Club
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default CreateClubPage;
