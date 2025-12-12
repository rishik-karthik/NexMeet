import React, { useState } from "react";
import "../App.css";
import { Link, Router, useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="landingPageContainer">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="landing-background-video"
      >
        <source src="/landing_page_bg.mp4" type="video/mp4" />
      </video>
      <nav className="navbar">
        <div className="nav-logo">
          <Link to={"/"}>
            <img src="/logo_h_100px.png" alt="NEXMEET" />
          </Link>
        </div>
        <button
          className={`mobile-menu-toggle ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className={`nav-list ${isMenuOpen ? "active" : ""}`}>
          <ul>
            <li
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/home");
              }}
            >
              Home
            </li>
            {/* replace url with random genereated string */}
            <li
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/enter-meeting-code-here");
              }}
            >
              Join as Guest
            </li>
            <li
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/auth");
              }}
            >
              Register
            </li>
            <li>
              <button
                className="login-btn"
                onClick={() => {
                  navigate("/auth");
                }}
              >
                Login
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Connect Instantly.</h1>
          <p className="hero-subtitle">
            Collaborate, and Communicate Seamlessly.
          </p>
          <p className="hero-line">
            Experience the future of virtual collaboration with NexMeet
          </p>
          <div className="hero-buttons">
            <button className="cta-primary">
              <Link to={"/auth"} className="link-tag">
                Get Started
              </Link>
            </button>
            <button className="cta-secondary">
              <Link to={"/about"} className="link-tag">
                Learn More
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
