import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/history.css";
import HistoryIcon from "@mui/icons-material/History";
import VideocamIcon from "@mui/icons-material/Videocam";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DescriptionIcon from "@mui/icons-material/Description";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function History() {
  const { getHistoryOfUser } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistroy = async () => {
      const histroy = await getHistoryOfUser();
      setMeetings(histroy || []);
    };
    fetchHistroy();
  }, []);

  let formatDate = (date) => {
    return new Date(date).toLocaleString("en-us", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleJoinMeeting = (meetingCode) => {
    navigate(`/${meetingCode}`);
  };

  return (
    <div className="history-container">
      <nav className="history-navbar">
        <div className="nav-logo">
          <img 
            src="/logo_h_100px.png" 
            alt="NEXMEET" 
            onClick={() => navigate("/home")} 
            style={{ cursor: "pointer" }} 
          />
        </div>
        <div className="nav-actions">
          <button className="nav-btn" onClick={() => navigate("/home")}>
            Home
          </button>
          <button 
            className="nav-btn logout-btn" 
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/auth");
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="history-content">
        <div className="history-header">
          <div className="history-title-wrapper">
            <HistoryIcon className="history-title-icon" />
            <h1 className="history-title">Meeting History</h1>
          </div>
          <p className="history-subtitle">Your past meetings and sessions</p>
        </div>

        {meetings.length === 0 ? (
          <div className="empty-history">
            <DescriptionIcon className="empty-icon" />
            <h2>No meetings yet</h2>
            <p>Start a new meeting to see your history here</p>
            <button className="cta-primary" onClick={() => navigate("/home")}>
              Start Meeting
            </button>
          </div>
        ) : (
          <div className="meetings-list">
            {meetings.map((meeting, index) => (
              <div 
                key={meeting._id} 
                className="meeting-row"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="meeting-row-content">
                  <div className="meeting-icon-wrapper">
                    <VideocamIcon className="meeting-icon" />
                  </div>
                  <div className="meeting-info">
                    <div className="meeting-code-section">
                      <span className="code-label">Meeting Code</span>
                      <span className="code-value">{meeting.meetingCode}</span>
                    </div>
                    <div className="meeting-date-section">
                      <CalendarTodayIcon className="date-icon" />
                      <span className="date-text">{formatDate(meeting.date)}</span>
                    </div>
                  </div>
                  <button 
                    className="join-meeting-btn"
                    onClick={() => handleJoinMeeting(meeting.meetingCode)}
                  >
                    Join Again
                    <ArrowForwardIcon className="join-arrow-icon" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
