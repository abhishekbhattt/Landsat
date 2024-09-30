import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Support from "./pages/Support";
import TrackingDash from "./pages/TrackingDash";
import PrivateRoute from "./components/PrivateRoute";
import SignIn from "./pages/SignIn";
import Header from "./components/Header";
import SignUp from "./pages/SignUp";
import Notification from "./pages/Notification";
import LandSat from "./pages/LandSat";
import SatelliteContext from "./pages/SatelliteContext";
// import { SatelliteProvider } from "./SatelliteContext";

function App() {
  return (
    <Router>
      <Header /> {/* Wrap the Routes with SatelliteProvider */}
      <div className="App">
        <Routes>
          {/* Ensure all paths start with a '/' */}
          <Route path="/" element={<Home />} />
          <Route element={<PrivateRoute />}>
            <Route path="/Profile" element={<Profile />} />
            <Route path="/Notification" element={<Notification />} />
          </Route>
          <Route path="/LandSat" element={<LandSat />} /> {/* Moved LandSat  */}
          <Route path="/Support" element={<Support />} />
          <Route path="/SatelliteContext" element={<SatelliteContext />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/About" element={<About />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/Notification" element={<Notification />} />
          <Route path="/TrackingDash" element={<TrackingDash />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
