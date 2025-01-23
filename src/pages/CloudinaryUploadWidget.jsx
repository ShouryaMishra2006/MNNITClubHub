import React from "react";

const CloudinaryUploadWidget = ({ onUploadSuccess }) => {
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
          console.log(result.info.secure_url)
          onUploadSuccess(uploadedInfo); 
        }
      }
    );
  };

  return (
    <button onClick={handleUpload} className="cloudinary-button">
      Upload Image
    </button>
  );
};

export default CloudinaryUploadWidget;
