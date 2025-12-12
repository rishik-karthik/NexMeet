import React from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import "../styles/about.css";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import StarIcon from "@mui/icons-material/Star";
import PublicIcon from "@mui/icons-material/Public";
import PeopleIcon from "@mui/icons-material/People";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="about-container">
      <nav className="navbar">
        <div className="nav-logo">
          <img
            src="/logo_h_100px.png"
            alt="NEXMEET"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          />
        </div>
        <div className="nav-list">
          <ul>
            <li onClick={() => navigate("/")}>Home</li>
            <li onClick={() => navigate("/auth")}>Login</li>
          </ul>
        </div>
      </nav>

      <div className="about-content">
        <div className="about-hero">
          <h1 className="about-title">About NexMeet</h1>
          <p className="about-subtitle">
            Connect, Collaborate, and Communicate Seamlessly.
          </p>
        </div>

        <div className="about-sections">
          <section className="about-section">
            <RocketLaunchIcon className="section-icon" />
            <h2>Introduction</h2>
            <p>
              This project is a part of my journey to learn and grow as a
              developer. I wanted to build something practical that would help
              me understand real-time communication, backend–frontend
              interaction, and overall full-stack development. Creating this
              video call app allowed me to practise what I’ve learned so far and
              gain confidence by working on a complete, functional project.
            </p>
          </section>

          <section className="about-section">
            <StarIcon className="section-icon" />
            <h2>Key Features</h2>
            <ul className="features-list">
              <li>
                <strong>Create Meeting</strong> – Generate a new meeting room
                instantly and share the ID.
              </li>
              <li>
                <strong>Join Meeting</strong> – Enter a valid meeting code to
                join an existing call.
              </li>
              <li>
                <strong>Screen Share</strong> – Share your screen in real time
                for collaboration.
              </li>
              <li>
                <strong>Real-Time Chat</strong> – Exchange text messages during
                the meeting using Socket.IO.
              </li>
              <li>
                <strong>Responsive UI</strong> – Works smoothly across laptops
                and mobile devices.
              </li>
              <li>
                <strong>Secure Login</strong> – Passwords are safely encrypted
                using bcrypt before storing.
              </li>
              <li>
                <strong>Meet History</strong> – Meeting history tracking
              </li>
            </ul>
          </section>

          <section className="about-section">
            <PublicIcon className="section-icon" />
            <h2>Technology</h2>
            <p>
              This application is built using the MERN stack along with
              real-time communication tools and modern frontend bundling:
            </p>
            <ul className="features-list">
              <li>
                <strong>MongoDB</strong> – Stores user accounts, meetings, and
                related data.
              </li>
              <li>
                <strong>Express.js</strong> – Handles API routes,
                authentication, and backend logic.
              </li>
              <li>
                <strong>React.js</strong> – Provides the user interface and
                manages state across the application.
              </li>
              <li>
                <strong>Node.js</strong> – Powers the server and manages WebRTC
                signaling.
              </li>
              <li>
                <strong>Socket.IO</strong> – Enables real-time communication for
                video call signaling and chat.
              </li>
              <li>
                <strong>Axios</strong> – Used for making HTTP requests like
                login, signup, and data fetches.
              </li>
              <li>
                <strong>Bcrypt</strong> – Hashes passwords for secure user
                authentication.
              </li>
              <li>
                <strong>Vite</strong> – A fast frontend build tool used to
                develop and bundle the React app.
              </li>
            </ul>
          </section>

          <section className="about-section">
            <PeopleIcon className="section-icon" />
            <h2>Get Started</h2>
            <p>
              Follow these easy steps to begin using the video call application:
            </p>
            <ol className="features-list">
              <li>
                Create an account or log in using your credentials.{" "}
                <button
                  className="cta-primary"
                  onClick={() => navigate("/auth")}
                >
                  SignUp
                </button>
              </li>
              <li>
                Select <strong>Create Meet</strong> to start a new session, or{" "}
                <strong>Join Meet</strong> if you have a meeting ID.
              </li>
              <li>Allow camera and microphone permissions when prompted.</li>
              <li>Start your call, share your screen, or chat in real time.</li>
            </ol>
            <div className="about-cta">
              <button className="cta-secondary" onClick={() => navigate("/")}>
                Back to Home
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
