import React, { useEffect, useRef, useState } from "react";
import "../styles/video.css";
import { connect } from "socket.io-client";
import { io } from "socket.io-client";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";
import CallEndIcon from "@mui/icons-material/CallEnd";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import server from "../environment";

const server_url = server;

export default function VideoMeetComponent() {
  const connectionsRef = useRef({});
  //stun server - lightweight servers running on public internet which returns the ip add of req's device
  //it gives the public ip address to others for communication
  const peerConfigConnections = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };
  let socketRef = useRef();
  let socketIdRef = useRef();

  let localVideoRef = useRef();

  let [videoAvailable, setVideoAvailable] = useState(true);
  let [audioAvailable, setAudioAvailable] = useState(true);
  let [video, setVideo] = useState();
  let [audio, setAudio] = useState();
  let [screen, setScreen] = useState();
  let [showModal, setShowModal] = useState(false);
  let [screenAvailable, setscreenAvailble] = useState();
  let [messages, setMessages] = useState([]);

  let [message, setMessage] = useState("");

  let [newMessages, setNewMessages] = useState(0);

  let [askForUsername, setAskForUsername] = useState(true);

  let [username, setUsername] = useState("");

  const videoRef = useRef([]);

  let [videos, setVideos] = useState([]);

  //ask for audio and video permission
  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoPermission) {
        setVideoAvailable(true);
        console.log("video -/");
      } else {
        setVideoAvailable(false);
      }
      const audioPermission = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      if (audioPermission) {
        setAudioAvailable(true);
        console.log("audio -/");
      } else {
        setAudioAvailable(false);
      }

      if (navigator.mediaDevices.getDisplayMedia) {
        setscreenAvailble(true);
      } else {
        setscreenAvailble(false);
      }

      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoAvailable,
          audio: audioAvailable,
        });

        if (userMediaStream) {
          //to store our(user) video, audio globally in localstream
          window.localStream = userMediaStream;
          if (localVideoRef.current) {
            //give refrence to ref variable of our stream
            localVideoRef.current.srcObject = userMediaStream;
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getPermissions();
    
    // Cleanup function to stop all tracks when component unmounts
    return () => {
      try {
        if (window.localStream) {
          window.localStream.getTracks().forEach((track) => track.stop());
        }
        if (localVideoRef.current && localVideoRef.current.srcObject) {
          localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        }
        // Close all peer connections
        for (let id in connectionsRef.current) {
          if (connectionsRef.current[id]) {
            connectionsRef.current[id].close();
          }
        }
        // Disconnect socket
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      } catch (e) {
        console.log("Cleanup error:", e);
      }
    };
  }, []);

  let getUserMediaSuccess = (stream) => {
    try {
      if (window.localStream) {
        window.localStream.getTracks().forEach((track) => track.stop());
      }
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    for (let id in connectionsRef.current) {
      if (id === socketIdRef.current) continue;

      // Remove old tracks
      const sender = connectionsRef.current[id].getSenders();
      sender.forEach((s) => {
        if (s.track) {
          connectionsRef.current[id].removeTrack(s);
        }
      });

      // Add new tracks
      window.localStream.getTracks().forEach((track) => {
        connectionsRef.current[id].addTrack(track, window.localStream);
      });

      connectionsRef.current[id].createOffer().then((description) => {
        console.log(description);
        connectionsRef.current[id]
          .setLocalDescription(description)
          .then(() => {
            if (socketRef.current) {
              socketRef.current.emit(
                "signal",
                id,
                JSON.stringify({ sdp: connectionsRef.current[id].localDescription })
              );
            }
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setVideo(false);
          setAudio(false);

          try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoRef.current.srcObject = window.localStream;

          for (let id in connectionsRef.current) {
            // Remove old tracks
            const sender = connectionsRef.current[id].getSenders();
            sender.forEach((s) => {
              if (s.track) {
                connectionsRef.current[id].removeTrack(s);
              }
            });

            // Add new tracks
            window.localStream.getTracks().forEach((track) => {
              connectionsRef.current[id].addTrack(track, window.localStream);
            });

            connectionsRef.current[id].createOffer().then((description) => {
              connectionsRef.current[id]
                .setLocalDescription(description)
                .then(() => {
                  if (socketRef.current) {
                    socketRef.current.emit(
                      "signal",
                      id,
                      JSON.stringify({ sdp: connectionsRef.current[id].localDescription })
                    );
                  }
                })
                .catch((e) => console.log(e));
            });
          }
        })
    );
  };
  let silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };
  let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };
  //whenever audio/video is changed =>useeffect to run
  let getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      //updates with current preference
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess) //globally updates for all connected device
        .then((stream) => {})
        .catch((e) => console.log(e));
    } else {
      try {
        let tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (e) {}
    }
  };
  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
      console.log("SET STATE HAS ", video, audio);
    }
  }, [video, audio]);

  let gotMessageFromServer = (fromId, message) => {
    try {
      var signal = JSON.parse(message);

      if (fromId !== socketIdRef.current && connectionsRef.current[fromId]) {
        if (signal.sdp) {
          connectionsRef.current[fromId]
            .setRemoteDescription(new RTCSessionDescription(signal.sdp))
            .then(() => {
              if (signal.sdp.type === "offer") {
                connectionsRef.current[fromId]
                  .createAnswer()
                  .then((description) => {
                    connectionsRef.current[fromId]
                      .setLocalDescription(description)
                      .then(() => {
                        if (socketRef.current) {
                          socketRef.current.emit(
                            "signal",
                            fromId,
                            JSON.stringify({
                              sdp: connectionsRef.current[fromId].localDescription,
                            })
                          );
                        }
                      })
                      .catch((e) => console.log(e));
                  })
                  .catch((e) => console.log(e));
              }
            })
            .catch((e) => console.log(e));
        }

        if (signal.ice) {
          connectionsRef.current[fromId]
            .addIceCandidate(new RTCIceCandidate(signal.ice))
            .catch((e) => console.log(e));
        }
      }
    } catch (e) {
      console.log("Error parsing signal:", e);
    }
  };

  let addMessage = (data, sender, socketIdSender) => {
    if (!data || !sender) return;
    
    setMessages((prev) => [...prev, { sender: sender, data: data, timestamp: Date.now() }]);

    setNewMessages((prev) => {
      // Only increment if message is from another user and chat is not open
      if (socketIdSender !== socketIdRef.current) {
        return prev + 1;
      }
      return prev;
    });
  };

  let connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false });

    socketRef.current.on("signal", gotMessageFromServer);

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", window.location.href, username);
      socketIdRef.current = socketRef.current.id;

      socketRef.current.on("chat-message", addMessage);

      socketRef.current.on("user-left", (id) => {
        // Close the peer connection when user leaves
        if (connectionsRef.current[id]) {
          connectionsRef.current[id].close();
          delete connectionsRef.current[id];
        }
        setVideos((videos) => videos.filter((video) => video.socketId !== id));
      });

      socketRef.current.on("user-joined", (id, clients, usernamesMap) => {
        clients.forEach((socketListId) => {
          // Skip if it's our own socket ID or connection already exists
          if (socketListId === socketIdRef.current || connectionsRef.current[socketListId]) {
            return;
          }
          
          // Get username for this socket
          const remoteUsername = usernamesMap && usernamesMap[socketListId] 
            ? usernamesMap[socketListId] 
            : `User ${socketListId.substring(0, 6)}`;

          //stun servers
          connectionsRef.current[socketListId] = new RTCPeerConnection(
            peerConfigConnections
          );
          // Wait for their ice candidate
          //ice -> interactive connecctivity establishment
          connectionsRef.current[socketListId].onicecandidate = function (event) {
            if (event.candidate != null && socketRef.current) {
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate })
              );
            }
          };

          // Wait for their video stream - using ontrack instead of deprecated onaddstream
          connectionsRef.current[socketListId].ontrack = (event) => {
            console.log("Received track from:", socketListId);
            const stream = event.streams[0];

            if (!stream) return;

            // Get username again in case it wasn't available earlier
            const currentUsername = usernamesMap && usernamesMap[socketListId] 
              ? usernamesMap[socketListId] 
              : remoteUsername || `User ${socketListId.substring(0, 6)}`;

            let videoExists = videoRef.current.find(
              (video) => video.socketId === socketListId
            );

            if (videoExists) {
              console.log("FOUND EXISTING");

              // Update the stream of the existing video
              setVideos((videos) => {
                const updatedVideos = videos.map((video) =>
                  video.socketId === socketListId
                    ? { ...video, stream: stream, username: currentUsername }
                    : video
                );
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            } else {
              // Create a new video
              console.log("CREATING NEW");
              let newVideo = {
                socketId: socketListId,
                stream: stream,
                username: currentUsername,
                autoplay: true,
                playsinline: true,
              };

              setVideos((videos) => {
                // Check if video with this socketId already exists
                const exists = videos.some(v => v.socketId === socketListId);
                if (exists) {
                  return videos;
                }
                const updatedVideos = [...videos, newVideo];
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            }
          };

          // Add the local video stream
          if (window.localStream !== undefined && window.localStream !== null) {
            window.localStream.getTracks().forEach((track) => {
              connectionsRef.current[socketListId].addTrack(track, window.localStream);
            });
          } else {
            let blackSilence = (...args) =>
              new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            window.localStream.getTracks().forEach((track) => {
              connectionsRef.current[socketListId].addTrack(track, window.localStream);
            });
          }
        });

        if (id === socketIdRef.current) {
          for (let id2 in connectionsRef.current) {
            if (id2 === socketIdRef.current) continue;

            try {
              if (window.localStream) {
                window.localStream.getTracks().forEach((track) => {
                  connectionsRef.current[id2].addTrack(track, window.localStream);
                });
              }
            } catch (e) {
              console.log(e);
            }

            connectionsRef.current[id2].createOffer().then((description) => {
              connectionsRef.current[id2]
                .setLocalDescription(description)
                .then(() => {
                  if (socketRef.current) {
                    socketRef.current.emit(
                      "signal",
                      id2,
                      JSON.stringify({ sdp: connectionsRef.current[id2].localDescription })
                    );
                  }
                })
                .catch((e) => console.log(e));
            });
          }
        }
      });
    });
  };

  let sendMessage = () => {
    if (!socketRef.current || !message.trim()) {
      return;
    }
    socketRef.current.emit("chat-message", message.trim(), username);
    setMessage("");
  };

  let getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

  let connect = () => {
    setAskForUsername(false);
    getMedia();
  };

  let handleVideo = () => {
    setVideo(!video);
    // getUserMedia();
  };
  let handleAudio = () => {
    setAudio(!audio);
    // getUserMedia();
  };

  let handleEndCall = () => {
    try {
      let tracks = localVideoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    } catch (e) {}
    window.location.href = "/home";
  };

  let getDisplayMediaSuccess = (stream) => {
    console.log("HERE");
    try {
      if (window.localStream) {
        window.localStream.getTracks().forEach((track) => track.stop());
      }
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    for (let id in connectionsRef.current) {
      if (id === socketIdRef.current) continue;

      // Remove old tracks
      const sender = connectionsRef.current[id].getSenders();
      sender.forEach((s) => {
        if (s.track) {
          connectionsRef.current[id].removeTrack(s);
        }
      });

      // Add new tracks
      window.localStream.getTracks().forEach((track) => {
        connectionsRef.current[id].addTrack(track, window.localStream);
      });

      connectionsRef.current[id].createOffer().then((description) => {
        connectionsRef.current[id]
          .setLocalDescription(description)
          .then(() => {
            if (socketRef.current) {
              socketRef.current.emit(
                "signal",
                id,
                JSON.stringify({ sdp: connectionsRef.current[id].localDescription })
              );
            }
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setScreen(false);

          try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoRef.current.srcObject = window.localStream;

          getUserMedia();
        })
    );
  };

  let getDisplayMedia = () => {
    if (screen === true) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then(getDisplayMediaSuccess)
          .then((stream) => {})
          .catch((e) => console.log(e));
      }
    } else {
      setScreen(false);
    }
  };
  useEffect(() => {
    if (screen !== undefined) {
      getDisplayMedia();
    }
  }, [screen]);
  let handleScreen = () => {
    setScreen(!screen);
  };

  return (
    <div>
      {askForUsername === true ? (
        <div className="lobby-container">
          <div className="lobby-card">
            <h2 className="lobby-title">Enter Meeting Lobby</h2>
            <div className="lobby-preview">
              <video ref={localVideoRef} autoPlay muted className="lobby-video"></video>
            </div>
            <div className="lobby-input-group">
              <input
                className="lobby-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && username.trim()) {
                    connect();
                  }
                }}
                placeholder="Enter your name"
              />
              <button 
                className="lobby-connect-btn"
                onClick={connect}
                disabled={!username.trim()}
              >
                Join Meeting
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="video-meet-container">
          <div className="video-grid">
            <div className="local-video-wrapper">
              <video ref={localVideoRef} autoPlay muted className="local-video"></video>
              <div className="video-label">{username || "You"}</div>
            </div>
            {videos.map((video) => (
              <div key={video.socketId} className="remote-video-wrapper">
                <video
                  data-socket={video.socketId}
                  ref={(ref) => {
                    if (ref && video.stream) {
                      if (ref.srcObject !== video.stream) {
                        ref.srcObject = video.stream;
                      }
                    }
                  }}
                  autoPlay
                  playsInline
                  className="remote-video"
                ></video>
                <div className="video-label">{video.username || `User ${video.socketId.substring(0, 6)}`}</div>
              </div>
            ))}
          </div>
          
          {showModal && (
            <div className="chat-modal">
              <div className="chat-header">
                <h2>Chat {newMessages > 0 && <span className="chat-badge">{newMessages}</span>}</h2>
                <button className="chat-close-btn" onClick={() => {
                  setShowModal(false);
                  setNewMessages(0);
                }}>
                  <CloseIcon />
                </button>
              </div>
              <div className="chatArea">
                {messages.map((m, i) => (
                  <div key={i} className={`chat-message ${m.sender === username ? 'own-message' : ''}`}>
                    <span className="chat-sender">{m.sender}</span>
                    <p className="chat-text">{m.data}</p>
                  </div>
                ))}
              </div>
              <div className="chat-input-container">
                <input
                  className="chat-input"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && message.trim()) {
                      sendMessage();
                    }
                  }}
                  type="text"
                  placeholder="Type a message..."
                />
                <button className="chat-send-btn" onClick={sendMessage} disabled={!message.trim()}>
                  <SendIcon className="send-icon" />
                </button>
              </div>
            </div>
          )}
          
          <div className="controls-bar">
            <button 
              className={`control-btn ${video ? 'active' : 'inactive'}`}
              onClick={handleVideo}
              title={video ? "Turn off video" : "Turn on video"}
            >
              {video ? <VideocamIcon /> : <VideocamOffIcon />}
            </button>
            <button 
              className={`control-btn ${audio ? 'active' : 'inactive'}`}
              onClick={handleAudio}
              title={audio ? "Mute" : "Unmute"}
            >
              {audio ? <MicIcon /> : <MicOffIcon />}
            </button>
            {screenAvailable && (
              <button 
                className={`control-btn ${screen ? 'active' : ''}`}
                onClick={handleScreen}
                title={screen ? "Stop sharing" : "Share screen"}
              >
                {screen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
              </button>
            )}
            <button 
              className="control-btn chat-btn"
              onClick={() => {
                setShowModal(!showModal);
                if (showModal) setNewMessages(0);
              }}
              title="Toggle chat"
            >
              <ChatIcon />
              {newMessages > 0 && <span className="notification-badge">{newMessages}</span>}
            </button>
            <button 
              className="control-btn end-call-btn"
              onClick={handleEndCall}
              title="End call"
            >
              <CallEndIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
