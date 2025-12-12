import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/footer.css";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import TwitterIcon from "@mui/icons-material/Twitter";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="global-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="nav-logo">
              <Link to={"/"}>
                <img src="/logo_h_100px.png" alt="NEXMEET" />
              </Link>
            </div>
            <p className="footer-description">
              Revolutionizing virtual collaboration. Connect seamlessly,
              Collaborate, Communicate effortlessly.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/");
                  }}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/about");
                  }}
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/auth"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/auth");
                  }}
                >
                  Login
                </a>
              </li>
              <li>
                <a
                  href="/home"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/home");
                  }}
                >
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-links">
              <li>
                <a href="/about">Features</a>
              </li>
              <li>
                <a href="/about">Technology</a>
              </li>
              <li>
                <a href="/history">Meeting History</a>
              </li>
              <li>
                <a href="/about">Get Started</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Connect</h4>
            <div className="social-links">
              <a
                href="https://github.com/rishik-karthik"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="GitHub"
              >
                <GitHubIcon />
              </a>
              <a
                href="https://www.linkedin.com/in/rishik-karthik-96919b313/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
              <a
                href="https://www.instagram.com/rishikkarthik/://www.instagram.com/rishikkarthik/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Twitter"
              >
                <TwitterIcon />
              </a>
              <a
                href="mailto:pr24eeb0b47@student.nitw.ac.in"
                className="social-link"
                aria-label="Email"
              >
                <EmailIcon />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © {new Date().getFullYear()}{" "}
            <span className="author-name">Rishik Karthik</span>. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
