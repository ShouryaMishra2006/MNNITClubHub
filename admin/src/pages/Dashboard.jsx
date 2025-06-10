import { useCompany } from "../context/CompanyContext";
import { useState, useEffect } from "react";
import axios from "axios";
import ResumeViewer from "../components/ResumeViewer";
import API_BASE_URL from "../config";
function Dashboard() {
  const { company } = useCompany();

  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.post(
          `${API_BASE_URL}/api/companies/jobs`,
          {
            company: company,
          }
        );
        setJobs(res.data);
        console.log(res.data)
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      }
    };

    fetchJobs();
  }, [company, description]);
  const toggleJobOpenStatus = async (jobId, currentStatus) => {
  try {
    await axios.patch(`${API_BASE_URL}/api/companies/toggle-status`, {
      jobId,             
      open: !currentStatus,
    });

    setJobs((prev) =>
      prev.map((job) =>
        job._id === jobId ? { ...job, open: !currentStatus } : job
      )
    );
  } catch (err) {
    console.error("Failed to update job status", err);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMsg("");
    console.log(description);
    console.log(company._id);
    if (!company) {
      setApiError("Company not found.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}/api/companies/createJob`,
        {
          description,
          companyId: company._id,
        }
      );

      if (res.status === 201) {
        setSuccessMsg("Job created and features extracted successfully!");
        setDescription("");
        fetchJobs();
      }
    } catch (err) {
      setApiError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-700 text-white p-4 text-center text-xl font-semibold">
        MNNIT Recruitment
      </nav>

      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Company Dashboard</h2>

        {!company ? (
          <p className="text-gray-600">No company data available.</p>
        ) : (
          <>
            <div className="bg-white shadow-md rounded p-6 mb-6">
              <h3 className="text-xl font-semibold mb-2">{company.name}</h3>
              <p className="text-gray-700">
                <strong>Email:</strong> {company.email}
              </p>
              <p className="text-gray-700">
                <strong>Contact:</strong> {company.contactNumber}
              </p>
            </div>

            {/* Job Description Form */}
            <div className="bg-white shadow-md rounded p-6">
              <h3 className="text-lg font-semibold mb-3">
                Create Job Description
              </h3>
              <form onSubmit={handleSubmit}>
                <textarea
                  rows="5"
                  className="w-full border border-gray-300 p-3 rounded mb-4"
                  placeholder="Enter job description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
                {apiError && <p className="text-red-500 mb-2">{apiError}</p>}
                {successMsg && (
                  <p className="text-green-600 mb-2">{successMsg}</p>
                )}

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Submit Job Description"}
                </button>
              </form>
            </div>
          </>
        )}
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-4">Posted Jobs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded shadow-md p-5 space-y-2"
              >
                <h2 className="text-lg font-semibold text-blue-700">
                  {job.llmExtractedFeatures[0]} @ {job.llmExtractedFeatures[1]}
                </h2>
                <div className="space-y-1">
                  {job.llmExtractedFeatures.slice(2).map((feature, index) => (
                    <p key={index}>
                      <strong></strong> {feature}
                    </p>
                  ))}
                </div>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={job.open ? "text-green-600" : "text-red-600"}
                  >
                    {job.open ? "Open" : "Closed"}
                  </span>
                </p>

                <button
                  onClick={() => toggleJobOpenStatus(job._id, job.open)}
                  className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  {job.open ? "Stop Accepting Resumes" : "Reopen Job"}
                </button>

                <div className="mt-4">
                  <ResumeViewer job={job}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
