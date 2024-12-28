import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Homepage";
import LoginUser from './pages/LoginUser';
import LoginAdmin from './pages/LoginAdmin'; 
import RegUser from "./pages/RegUser";
import AdminDashboard from "./AdminDashboard";
import UserPage from "./pages/UserPage";
import UserClubs from "./pages/UserClubs";
import JoinedClubs from "./pages/JoinedClubs";
import ClubOverview from "./pages/ClubOverview"
import Profile from "./pages/UserCredentials"
import CreateClub from "./pages/createClub"
import Createvent from "./pages/createvent"
import ClubUser from "./pages/clubuser"
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/LoginUser" element={<LoginUser />} />
          <Route path="/LoginAdmin" element={<LoginAdmin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/RegUser" element={<RegUser/>}/>
          <Route path="/UserPage" element={<UserPage/>}/>
          <Route path="/UserClubs" element={<UserClubs/>}/>
          <Route path="/ClubOverview/:clubId" element={<ClubOverview/>}/>
          <Route path="/ClubUser/:clubId" element={<ClubUser/>}/>
          <Route path="/Profile" element={<Profile/>}/>
          <Route path="/createClub" element={<CreateClub/>}/>
          <Route path="/createvent" element={<Createvent/>}/>
          <Route path="/JoinedClubs" element={<JoinedClubs/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
