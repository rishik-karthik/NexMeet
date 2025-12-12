import { useState } from "react";
import "./App.css";
import { Route, Router, Routes, useLocation } from "react-router-dom";
import LandingPage from "./pages/landing.jsx";
import Authentication from "./pages/authentication.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import VideoMeetComponent from "./pages/VideoMeet.jsx";
import History from "./pages/History.jsx";
import HomeComponent from "./pages/Home.jsx";
import About from "./pages/about.jsx";
import Footer from "./components/Footer.jsx";

function AppRoutes() {
  const location = useLocation();
  // Hide footer on video meet pages (any route that's not a standard page)
  const hideFooter = location.pathname !== '/' && 
                     location.pathname !== '/home' &&
                     location.pathname !== '/auth' &&
                     location.pathname !== '/about' &&
                     location.pathname !== '/history' &&
                     !location.pathname.startsWith('/home') &&
                     !location.pathname.startsWith('/auth') &&
                     !location.pathname.startsWith('/about') &&
                     !location.pathname.startsWith('/history');

  return (
    <>
      <Routes>
        <Route path="/home" element={<HomeComponent/>} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Authentication />} />
        <Route path="/about" element={<About />} />
        <Route path="/history" element={<History/>}/>
        <Route path="/:url" element={<VideoMeetComponent />} />
      </Routes>
      {!hideFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <>
      <AuthProvider>
        <div className="app-wrapper">
          <AppRoutes />
        </div>
      </AuthProvider>
    </>
  );
}

export default App;
