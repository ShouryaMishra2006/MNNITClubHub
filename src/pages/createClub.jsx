import React, { useState } from "react";
import { useNavigate ,useParams} from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_BASE_URL from "../config";
function CreateClubPage() {
  const { user } = useParams();
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [president, setPresident] = useState("");
  const [members, setMembers] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();
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
          const uploadedInfo = result.info;
          console.log("Uploaded Image Info:", uploadedInfo);
          console.log(result.info.secure_url);
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
    }
    axios
      .post(
        `${API_BASE_URL}/api/createClub`,
        { name, description, president, username, members, imageUrl },
        { withCredentials: true }
      )
      .then((result) => {
        if (result.data.success) {
          toast.success("Club created successfully!", {
            autoClose: 3000,
          });
          navigate(`/UserPage/${username}`);
        } else {
          toast.error("Failed to create club: " + result.data.message, {
            autoClose: 3000,
          });
        }
      })
      .catch((err) => {
        toast.error("Error creating club", {
          autoClose: 3000,
        });
      });
  };
  const handleImageUpload = () => {
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
  const handleSuccess = (result) => {
    if (result && result.info) {
      const uploadedImageUrl = result.info.secure_url; 
      setImageUrl(uploadedImageUrl); 

      console.log("Image uploaded successfully:", uploadedImageUrl); 
    }
  };
  const handleUploadSuccess = (result) => {
    console.log("Received Info in Parent Component:", result.info);
    setImageUrl(result.info.secure_url);
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-purple-400 max-w-full">
      <div className="bg-gray shadow-lg rounded-lg p-8 w-full max-w-md bg-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create Club
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-semibold mb-2"
            >
              Club Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Club Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 font-semibold mb-2"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              placeholder="Description of the club"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              rows="4"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="president"
              className="block text-gray-700 font-semibold mb-2"
            >
              President
            </label>
            <input
              type="text"
              name="president"
              id="president"
              placeholder="President's Name (optional)"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              onChange={(e) => setPresident(e.target.value)}
              value={president}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="members"
              className="block text-gray-700 font-semibold mb-2"
            >
              Initial Members
            </label>
            <input
              type="number"
              name="members"
              id="members"
              placeholder="Number of Initial Members"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              onChange={(e) => setMembers(e.target.value)}
              value={members}
              min="0"
            />
          </div>
          <button
            onClick={(event) => {
              event.preventDefault(); 
              handleUpload(); 
            }}
            className="cloudinary-button"
          >
            Upload Image
          </button>

          {/* Display the uploaded image */}
          {imageUrl && (
            <div>
              <h3>Uploaded Image:</h3>
              <img
                src={imageUrl}
                alt="Uploaded Club"
                style={{ width: "200px", height: "auto" }}
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
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
