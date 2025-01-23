
import React, { useState } from 'react';
import '../style/UserCredentials.css';

function UserCredentials({ userData }) {
  const [user, setUser] = useState(userData);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(userData.profilePhoto);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Logic to save the updated user info (e.g., API call)
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="user-profile">
      <h2>User Profile</h2>

      {/* Profile Photo Section */}
      <div className="profile-photo-section">
        <img src={profilePhoto} alt="Profile" className="profile-photo" />
        {isEditing && (
          <input type="file" onChange={handlePhotoChange} />
        )}
      </div>

      <form>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={user.address}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <label>Bio:</label>
          <textarea
            name="bio"
            value={user.bio}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="form-buttons">
          {isEditing ? (
            <button type="button" onClick={handleSave}>Save</button>
          ) : (
            <button type="button" onClick={handleEditToggle}>Edit Profile</button>
          )}
          {isEditing && (
            <button type="button" onClick={handleEditToggle}>Cancel</button>
          )}
        </div>
      </form>
    </div>
  );
}

export default UserCredentials;
