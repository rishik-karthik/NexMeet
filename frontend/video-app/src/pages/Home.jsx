import React, { useContext, useState } from "react";
// import withAuth from '../utils/withAuth'
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import { Button, IconButton, TextField } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import LoginIcon from "@mui/icons-material/Login";
import { AuthContext } from "../contexts/AuthContext";

function HomeComponent() {
  let navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");

  const { addToUserHistory } = useContext(AuthContext);
  let handleJoinVideoCall = async () => {
    await addToUserHistory(meetingCode);
    navigate(`/${meetingCode}`);
  };

  return (
    <>
      <div className="navBar">
        <img src="/logo_h_100px.png" alt="NEXMEET" style={{ cursor: "pointer" }} onClick={() => navigate("/")} />

        <div className="navBar-actions">
          <IconButton
            onClick={() => {
              navigate("/history");
            }}
            className="history-icon-btn"
          >
            <RestoreIcon className="history-icon" />
          </IconButton>
          <span>History</span>

          <Button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/auth");
            }}
            className="logout-btn"
            startIcon={<LoginIcon />}
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="meetContainer">
        <div className="leftPanel">
          <h2 className="hero-subtitle">Click in. Tune in. Join Meet!</h2>
          <p className="hero-description">
            Enter a meeting code below to join an existing meeting or create a new one to start collaborating.
          </p>

          <label className="form-label">
            <VideoCallIcon className="form-icon" />
            Meeting Code
          </label>
          <TextField
            onChange={(e) => setMeetingCode(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && meetingCode.trim()) {
                handleJoinVideoCall();
              }
            }}
            id="meeting-code-input"
            placeholder="Enter meeting code"
            variant="outlined"
            fullWidth
            className="meeting-input"
          />
          <Button 
            onClick={handleJoinVideoCall} 
            variant="contained"
            className="join-meeting-btn"
            disabled={!meetingCode.trim()}
            startIcon={<VideoCallIcon />}
            fullWidth
          >
            Join Meeting
          </Button>

          <p className="or-divider">or</p>
          <Button 
            onClick={() => {
              const randomCode = Math.random().toString(36).substring(2, 8);
              navigate(`/${randomCode}`);
            }}
            className="create-meeting-btn"
            variant="outlined"
            fullWidth
          >
            Create New Meeting
          </Button>
        </div>
        <div className="rightPanel">
          <img src="/blackhole_gif.gif" alt="Background" className="rightPanel-bg" />
        </div>
      </div>
    </>
  );
}

export default HomeComponent;
