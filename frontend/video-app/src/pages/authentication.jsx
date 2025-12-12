import React, { useContext } from "react";
import { useState } from "react";
import "../App.css";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Authentication() {
  const navigate = useNavigate();
  const { handleLogin, handleRegister } = useContext(AuthContext);
  const [details, setDetails] = useState({
    name: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [messages, setMessages] = useState("");
  const [formState, setFormState] = useState(0); // 0 = Sign Up, 1 = Login

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user types
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessages("");

    // Basic validation
    if (!details.username || !details.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (formState === 0) {
      // Sign Up
      if (!details.name) {
        setError("Name is required for sign up");
        return;
      }
      let res = await handleRegister(
        details.name,
        details.username,
        details.password
      );
      if (res === "User Already Exists") {
        setError("User already exists");
        return; // do NOT proceed to login screen
      }
      setMessages("Sign up successful! Now Login...");
      setFormState(1);
      console.log("Sign Up:", details);
    }
    if (formState === 1) {
      const res = await handleLogin(details.username, details.password);

      if (res !== "OK") {
        setError("Login failed");
        return;
      }

      setMessages("Login successful! Redirecting...");
      navigate("/");
    }
  };

  const toggleForm = () => {
    setFormState((prev) => (prev === 0 ? 1 : 0));
    setError("");
    setMessages("");
    setDetails({ name: "", username: "", password: "" });
  };

  return (
    <div className="auth-form">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>{formState === 0 ? "Create Account" : "Welcome Back"}</h2>
            <p>
              {formState === 0 ? "Sign up to get started" : "Login to continue"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form-content">
            {formState === 0 && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={details.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="form-input"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={details.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={details.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="form-input"
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {messages && <div className="success-message">{messages}</div>}

            <button type="submit" className="auth-submit-btn">
              {formState === 0 ? "Sign Up" : "Login"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              {formState === 0
                ? "Already have an account? "
                : "Don't have an account? "}
              <span className="toggle-link" onClick={toggleForm}>
                {formState === 0 ? "Login" : "Sign Up"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
