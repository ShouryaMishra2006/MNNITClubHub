import React, { useEffect, useState, useRef } from "react";

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedResume, setSelectedResume] = useState({});
  const [uploading, setUploading] = useState({});
  const inputRefs = useRef({}); // Store refs per jobId

  useEffect(() => {
    fetch("http://localhost:3001/api/getalljobs")
      .then((res) => res.json())
      .then((data) => setJobs(data.jobs || []))
      .catch((err) => console.error("Failed to load jobs", err));
  }, []);

  const handleFileChange = (e, jobId) => {
    setSelectedResume((prev) => ({
      ...prev,
      [jobId]: e.target.files[0],
    }));
  };

  const handleUpload = async (jobId) => {
    const file = selectedResume[jobId];
    if (!file) {
      alert("Please select a resume file first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobId", jobId);

    try {
      setUploading((prev) => ({ ...prev, [jobId]: true }));

      const res = await fetch(
        "http://localhost:3001/api/companies/resume/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await res.json();
      if (res.ok) {
        alert("Resume uploaded successfully!");
        console.log("Updated job data:", result.job);

        setSelectedResume((prev) => ({ ...prev, [jobId]: null }));
        if (inputRefs.current[jobId]) {
          inputRefs.current[jobId].value = null;
        }
      } else {
        alert("Upload failed: " + result.error);
      }
    } catch (err) {
      console.error("Error uploading resume:", err);
      alert("Error uploading resume.");
    } finally {
      setUploading((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  return (
    <div className="p-8 text-gray-200">
      <h2 className="text-3xl font-bold text-center mb-6 text-purple-400">
        Available Job Openings
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-gray-800 p-6 rounded-lg shadow-lg border border-purple-600"
          >
            <h3 className="text-xl font-bold text-yellow-300">
              {job.llmExtractedFeatures[0] || "Company"}
            </h3>

            <div className="mt-2 space-y-1">
              {job.llmExtractedFeatures.slice(1).map((feature, index) => (
                <p key={index} className="text-gray-300">
                  {feature}
                </p>
              ))}
            </div>

            <div className="mt-4">
              <label className="block mb-2 text-sm font-semibold text-gray-300">
                Upload your resume:
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                ref={(el) => (inputRefs.current[job._id] = el)}
                onChange={(e) => handleFileChange(e, job._id)}
                className="block w-full text-sm text-gray-300 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer focus:outline-none"
              />
              <button
                disabled={uploading[job._id]}
                onClick={() => handleUpload(job._id)}
                className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {uploading[job._id] ? "Uploading..." : "Submit Resume"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobBoard;
