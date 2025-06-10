# MNNITClubHub

MNNITClubHub is a dynamic web platform tailored exclusively for the students and companies associated with Motilal Nehru National Institute of Technology (MNNIT), Allahabad. It enables students to create and manage clubs, host events, engage in real-time discussions, and explore campus job opportunities. Meanwhile, companies can register, post jobs, and recruit talent using AI-powered resume parsing and matching.

# ✨ KEY FEATURES

# 🎓 Student Portal — Empowering MNNIT Students

The Student Portal is the heart of MNNITClub, designed to foster community engagement, enhance event participation, and simplify the campus placement process.

🧑‍💻 Key Functionalities:

🔐 MNNIT-Only Access: Only students with verified MNNIT email IDs can register, ensuring an exclusive and secure network.

🏢 Club Creation & Administration:

Students can create new clubs and automatically become the admin.

Admins can approve/reject membership requests, create events, and manage discussions.

💬 Real-time Discussions:

Built-in Socket.io-based chat system allows seamless and live club discussions.

Promotes better coordination for events, projects, and brainstorming among club members.

📅 Event Management:

Club admins can schedule events, track participation, and notify members.

Students can RSVP and get reminders for events they're part of.

👥 Member Directory:

Easily view the list of active club members, fostering stronger networking within the institute.

💼 Job Openings & Resume Submission:

Access all job openings posted by companies visiting MNNIT.

Upload resumes with just one click, which are then parsed and scored for each job.

🎯 Why It Matters:

Builds leadership and teamwork among students.

Encourages community-driven learning through clubs.

Acts as a centralized hub for career growth, extracurriculars, and technical exposure.

# 🏢 Company Panel — Streamlining Campus Hiring

The Company Panel empowers recruiters to manage their campus hiring pipeline with AI-assisted tools and direct student engagement.

🛠 Key Functionalities:

📝 Company Registration & Verification:

Companies can register securely and gain access to their personalized dashboard.

💼 Job Posting with LLM Parsing:

Post detailed job descriptions for specific roles.

Integrated with LLM (Llama3 via Groq) to automatically parse job descriptions and highlight key requirements.

📄 Resume Parsing & Scoring:

Every uploaded resume is parsed using LangChain, extracting key fields like:

Full Name, Email, Phone

Education, Skills, Experience, Core Qualifications

Each resume is scored for similarity against the job description using AI.

Helps in ranking candidates more effectively.

📧 Candidate Outreach:

Send personalized emails to shortlisted candidates directly from the portal.

Option to export parsed data or connect externally.

🚫 Close Job Openings:

Once the desired number of candidates is reached, the company can close listings, preventing spam applications.

🎯 Why It Matters:

Greatly reduces manual screening effort for hiring teams.

Ensures better candidate-job alignment through automated parsing and scoring.

Encourages more companies to recruit from MNNIT due to the seamless platform experience.

Provides data-backed hiring decisions based on AI similarity metrics.

# 🛠️ Tech Stack

💻 Frontend

React.js (with Vite)

TailwindCSS for modern, responsive UI

Socket.io for real-time club discussions

React Router for navigation

🧠 Backend

Node.js + Express.js

MongoDB for document-based data storage

Mongoose for Object Document Mapper

Python for LLM resume parsing

LangChain + Llama3 (Groq API) for intelligent feature extraction

🔧 Other Tools & APIs

Nodemailer for sending emails

Multer for handling file uploads (PDF resumes)

dotenv for environment configuration

JWT for secure authentication

# 🔍 Real World Impact

“Bridging the gap between students and recruiters, fostering community building on campus.”

🎓 Encourages active club participation among MNNIT students.

🤝 Builds community interaction through real-time chat and events.

📈 Boosts placement efficiency via smart resume screening & feature extraction.

💼 Provides a centralized portal for students and companies during campus placements.

# 🚀 Future Scope & Improvements

The MNNITClub platform lays a strong foundation for managing student clubs, hosting events, and enabling campus recruitment. To scale this project to real-world production use and broaden its adoption across institutions, we plan to implement the following advanced features:

🔄 1. Batch Resume Processing with Queues

Challenge: Parsing resumes one-by-one creates performance bottlenecks.

Solution: Implement batch processing via message queues (e.g., RabbitMQ, BullMQ, or Kafka) to handle large volumes of resume uploads asynchronously.

Impact: Enhances system responsiveness and stability under heavy load.

🌐 2. Multi-Institute Expansion

Goal: Support onboarding of multiple colleges and universities.

Approach: Introduce institute-level segregation (multi-tenancy via separate schemas or databases).

Outcome: Enables nationwide adoption and networking between clubs across institutes.

📊 3. Interactive Analytics Dashboards

For Clubs: View metrics like event participation, active members, and engagement trends.

For Companies: Access application stats, resume match scores, and recruitment conversion rates.

Tech Stack: Use Recharts, Chart.js, or D3.js for data visualization.

📢 4. Virtual Event Hosting

New Feature: Enable clubs to organize and conduct virtual seminars, hackathons, workshops, and online competitions through the platform.

Integration Options: Add support for Zoom, Google Meet, Jitsi, or custom WebRTC-based video rooms.

Impact: Increases club reach, promotes inclusion, and supports hybrid or fully remote activities.

☁️ 5. Cloud-Optimized Resume Storage

Improvement: Shift from local resume storage to cloud solutions like AWS S3, Google Cloud Storage, or Firebase Storage.

Advantages: Scalability, security, and global access with expirable links.

# 📁 Project Structure

This repository is organized into different branches and directories to separate concerns clearly:

🔀 Branches

main:

Contains the complete frontend code.

👨‍🎓 Student Portal: Root of the main branch.

🏢 Company Panel (Admin): Located inside the admin/ folder within main.

backend:

Contains the entire Node.js backend, including:

Authentication

Resume parsing logic

MongoDB models & controllers

LLM integration for job description parsing

Email service logic
