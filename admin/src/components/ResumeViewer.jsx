import { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
function ResumeViewer({ job }) {
  const resumes = job.topResumes || [];
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(null);
  const [loadingScore, setLoadingScore] = useState(false);
  const [emailSentStatus, setEmailSentStatus] = useState(
    Array(resumes.length).fill(false)
  );

  const handleNext = () => {
    if (index < resumes.length - 1) {
      setIndex(index + 1);
      setScore(null);
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex(index - 1);
      setScore(null);
    }
  };

  const handleFindScore = async () => {
    setLoadingScore(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/companies/resumescore`, {
        jobId: job._id,
        resumeIndex: index,
      });
      setScore(res.data.score);
    } catch (err) {
      console.error("Error fetching score:", err);
      alert("Failed to compute score.");
    } finally {
      setLoadingScore(false);
    }
  };

  const handleSendEmail = async (jobId, resumeIndex) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/companies/send-shortlist-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId, resumeIndex }),
      });

      const data = await response.json();
      if (response.status === 200) {
        alert("Email sent successfully");
        setEmailSentStatus((prev) => {
          const updated = [...prev];
          updated[resumeIndex] = true;
          return updated;
        });
      }

      console.log("Email sent:", data);
    } catch (err) {
      console.error("Error sending email:", err);
    }
  };

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Resumes:</h4>
      {resumes.length > 0 ? (
        <div className="border rounded-lg p-4 shadow-md bg-white">
          <div>
            <strong>Email:</strong> {resumes[index].studentEmail}
          </div>
          <div className="mt-2">
            <strong>Features:</strong>
            <ul className="list-disc list-inside pl-4 text-sm text-gray-700 mt-1">
              {resumes[index].parsedFeatures.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </div>

          {/* Buttons Section */}
          <div className="flex items-center space-x-4 mt-4">
            <button
              onClick={handleFindScore}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={loadingScore}
            >
              {loadingScore ? "Calculating..." : "Find Score"}
            </button>

            <button
              onClick={() => handleSendEmail(job._id, index)}
              className={`px-3 py-1 text-white rounded ${
                emailSentStatus[index]
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              disabled={score === null || emailSentStatus[index]}
            >
              {emailSentStatus[index] ? "Email Sent" : "Send Email"}
            </button>

            {score !== null && (
              <span className="text-sm text-gray-700">
                Similarity Score: <strong>{(score * 100).toFixed(2)}%</strong>
              </span>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrev}
              disabled={index === 0}
              className="text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              {index + 1} of {resumes.length}
            </span>
            <button
              onClick={handleNext}
              disabled={index === resumes.length - 1}
              className="text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No resumes submitted yet.</p>
      )}
    </div>
  );
}

export default ResumeViewer;
