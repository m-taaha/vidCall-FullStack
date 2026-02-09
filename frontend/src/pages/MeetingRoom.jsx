import React, { useEffect, useRef, useState } from 'react'
import { useMeeting } from '../context/MeetingContext'
import { useNavigate, useParams } from 'react-router-dom';
import {io} from "socket.io-client";
import Peer from 'simple-peer';
import Video from '../components/Video';
import ChatSidebar from '../components/ChatSidebar';
import ControlBar from '../components/ControlBar';

// Helper for when YOU are the caller 
// We pass socketRef so the peer can send its "business card" (signal) to the server
function createPeer(userToSignal, callerId, stream, socketRef) {
  const peer = new Peer({
    initiator: true, // You start the handshake
    trickle: false,
    stream,
    config: {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    },
  });

  peer.on("signal", (signal) => {
    socketRef.current.emit("signal", { userToSignal, callerId, signal });
  });

  return peer;
}

//  Helper for when YOU are the receiver 
function addPeer(incomingSignal, callerId, stream, socketRef) {
  const peer = new Peer({
    initiator: false, // You wait for the handshake
    trickle: false,
    stream,
    config: {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    },
  });

  peer.on("signal", (signal) => {
    socketRef.current.emit("signal", { 
        userToSignal: callerId, 
        signal, 
        callerId: socketRef.current.id 
    });
  });

  // Accept the caller's signal immediately
  peer.signal(incomingSignal);

  return peer;
}

function MeetingRoom() {
  const { audio, setAudio, camera, setCamera } = useMeeting();
  const [peers, setPeers] = useState([]);
  const videoRef = useRef(null);
  const socketRef = useRef();
  const peersRef = useRef([]);
  const { id } = useParams();
  const [stream, setStream] = useState(null);
  const navigate = useNavigate();
  // meeting constraints
  const constraints = {
    video: camera,
    audio: audio,
  };
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [screenStream, setScreenStream] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const totalParticipants = peers.length + 1;

  let gridClass = "";
  if (totalParticipants === 1) {
    gridClass = "grid-cols-1";
  } else if (totalParticipants <= 4) {
    gridClass = "grid-cols-2";
  } else {
    gridClass = "grid-cols-3";
  }

  //logic to handle user media (CAmera/Mic)
  useEffect(() => {
    let isMounted = true;
    let localStream;
    const startStream = async () => {
      // checking if we acutally need the hardware righ tnow
      if(!camera && !audio) {
        console.log("Both camera and mic are off. Skipping hardware request.");
        return;
      }
      try {
        const s = await navigator.mediaDevices.getUserMedia(constraints);
        if(!isMounted) {
          console.log("User left during loading. Stopping ghost tracks.");
          s.getTracks().forEach(t => t.stop());
          return;
        }

        localStream = s;
        setStream(s);

        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (error) {
        console.error("Error in accessing media devices", error);
      }
    };

    startStream();

    // clearn up
    return () => {
      isMounted = false;
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);



  // main signalling effect
  // here we are handling how are we going to manage members - suppose there are already 3 members in the meaning then you joined - then this function will loop through the existing socket id's present in the connection and make a call to all of them one by one - then when you entered once - after you a new user came and entered then here you and the other users present in the connection or meeting will acts as reciever and the new user will act like a caller
  useEffect(() => {
    if (!stream) return; //wait until local camera is ready

    // initialize the connection backend port
    socketRef.current = io(import.meta.env.VITE_BACKEND_URL);

    // here people already there - you are the caller here -
    socketRef.current.on("connect", () => {
      socketRef.current.on("all users", (users) => {
        const newPeers = [];
        users.forEach((userId) => {
          // Logic for calling existing users
          const peer = createPeer(
            userId,
            socketRef.current.id,
            stream,
            socketRef,
          );

          const peerObj = {
            peerID: userId,
            peer,
          };

          peersRef.current.push(peerObj);
          newPeers.push(peerObj);
        });

        setPeers(newPeers); //Update our React state so the UI can render these users
      });

      // Listening for someone joining AFTER you
      socketRef.current.on("User joined", (data) => {
        console.log(
          "Someone new joined! I should wait for their call.",
          data.socketId,
        );
      });

      //  The Signal "Postman" - receiving data from other peers
      socketRef.current.on("signal", (data) => {
        const { senderId, signal } = data;
        const item = peersRef.current.find((p) => p.peerID === senderId);

        if (item) {
          item.peer.signal(signal);
        } else {
          const peer = addPeer(signal, senderId, stream, socketRef);
          const peerObj = {
            peerID: senderId,
            peer,
          };
          peersRef.current.push(peerObj);
          setPeers((prev) => [...prev, peerObj]);
        }
      });
    });

    // tell the server you have joined
    socketRef.current.emit("join-room", id);

    // message in meetRoom
    socketRef.current.on("chat-message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // tell the server user has left
    socketRef.current.on("user-left", (id) => {
      console.log("User left:", id);

      setPeers((prevPeers) => {
        const peerObj = prevPeers.find((p) => p.peerID === id);

        if (peerObj) {
          peerObj.peer.destroy();
        }

        return prevPeers.filter((p) => p.peerID !== id);
      });

      // Update the Ref to keep the signaling logic in sync
      // This prevents us from trying to send signals to a closed connection
      peersRef.current = peersRef.current.filter((p) => p.peerID !== id);
    });

    // cleanup: disconnect when the component unmounts
    return () => {
      socketRef.current.disconnect();
    };
  }, [id, stream]);

  const sendMessage = () => {
    if (currentMessage.trim() !== "") {
      const messageData = {
        roomId: id,
        messageText: currentMessage,
      };

      socketRef.current.emit("chat-message", messageData, "You");

      setMessages((prev) => [
        ...prev,
        {
          sender: "You",
          text: currentMessage,
        },
      ]);

      setCurrentMessage("");
    }
  };

  // start screen sharing
  const startScreenShare = async () => {
    try {
      const screen = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      // SAFETY: Listen for the browser's "Stop Sharing" button
      screen.getVideoTracks()[0].onended = () => {
        stopScreenShare(true);
      };

      setScreenStream(screen);
      setIsSharing(true);

      // upading the local video element
      if (videoRef.current) {
        videoRef.current.srcObject = screen;
      }

      // broadcasting to peers who are connected
      const oldTrack = stream ? stream.getVideoTracks()[0] : null;
      const newTrack = screen.getVideoTracks()[0];

      peersRef.current.forEach((peerObj) => {
        peerObj.peer.replaceTrack(oldTrack, newTrack, stream);
      });
    } catch (error) {
      console.log("Error sharing screen:", err);
    }
  };

  // stop screen share
  const stopScreenShare = () => {
    if (!screenStream) return;

    const screenTrack = screenStream.getVideoTracks()[0];
    const cameraTrack = stream.getVideoTracks()[0];

    peersRef.current.forEach((peerObj) => {
      peerObj.peer.replaceTrack(screenTrack, cameraTrack, stream);
    });

    // physically stop the screen capture in the browser
    screenStream.getTracks().forEach((track) => track.stop());

    videoRef.current.srcObject = stream;
    setScreenStream();
    setScreenStream(null);
    setIsSharing(false);
  };

  // toggleCamera hardware-level on off camera and starting a new or old stream based on condition
  const toggleCamera = async () => {
    // turning off: stop tracks and update state
    if (camera) {
      if (stream) {
        stream.getVideoTracks().forEach((track) => track.stop());
      }
      setCamera(false);
    } else {
      // turning on: get freash hardware access
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: audio,
        });

        const newVideoTrack = newStream.getVideoTracks()[0];
        const oldVideoTrack = stream?.getVideoTracks()[0];

        if (oldVideoTrack) {
          //  existing track swap
          // tell all the peers to switch tracks
          peersRef.current.forEach(({ peer }) => {
            peer.replaceTrack(oldVideoTrack, newVideoTrack, stream);
          });
        } else {
          // this is the first video track fo this session
          // using peer.addTrack() instead of replaceTrack()
          peersRef.current.forEach(({ peer }) => {
            peer.addTrack(newVideoTrack, newStream);
          });
        }

        // updating the local visuals
        setStream(newStream);
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
        setCamera(true);
      } catch (error) {
        console.error("Error restarting camera:", error);
      }
    }
  };

  // toggleAudio  hardware-level on off audio and starting a new or old stream based on condition
  const toggleAudio = async () => {
    if(audio) {
      // turning off
      if(stream) {
        stream.getAudioTracks().forEach(track => track.stop());
      }
      setAudio(false);
    } else {
      // turning on
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: camera, //keep existing camera state
        });

        const newAudioTrack = newStream.getAudioTracks()[0];
        const oldAudioTrack = stream?.getAudioTracks()[0];


        if (oldAudioTrack) {
          //  existing track swap
          // tell all the peers to switch tracks
          peersRef.current.forEach(({ peer }) => {
            peer.replaceTrack(oldAudioTrack, newAudioTrack, stream);
          });
        } else {
          // this is the first video track fo this session
          // using peer.addTrack() instead of replaceTrack()
          peersRef.current.forEach(({ peer }) => {
            peer.addTrack(newAudioTrack, newStream);
          });
        }

        // updating the local visuals
        setStream(newStream);


        if (camera && videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
        setAudio(true);
      } catch (error) {
        console.error("Error in restarting microphone", error);
      }
    } 
  };

  // handleLeave
  const handleLeave = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        console.log("Stopping track;", track.kind);
        track.stop();
      });
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    peersRef.current.forEach((p) => p.peer.destroy());
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden relative">
      <div className="flex-1 flex flex-col p-4 relative overflow-hidden">
        {/* main video grid */}
        <div
          className={`grid gap-4 h-[calc(100vh-160px)] w-full mx-auto transition-all duration-300 ${gridClass}`}
        >
          {/* local video tile (host- you) */}
          <div className="relative bg-slate-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl ">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${!isSharing ? "-scale-x-100" : ""}`}
            />

            {/* overdflow for name/status */}
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop:blur-md px-3 py-1 rounded-lg text-sm border border-white/10">
              You
            </div>

            {/* if camera is off, show placeholder */}
            {!camera && !isSharing && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center text-3xl font-bold">
                  U
                </div>
              </div>
            )}
          </div>

          {/* remote video placeholder (wait for person 2)  */}
          {peers.map((peerObj) => (
            <Video key={peerObj.peerID} peer={peerObj.peer} />
          ))}

          {peers.length === 0 && (
            <div className="relative bg-slate-900 rounded-3xl border border-dashed border-white/20 flex items-center justify-center text-slate-500">
              <div className="text-center">
                <p className="animate-pulse">Waiting for others to join...</p>
                <p className="text-xs mt-2 font-mono text-slate-600">
                  ID: {id}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* control bar */}
        <ControlBar
          audio={audio}
          setAudio={toggleAudio}
          camera={camera}
          setCamera={toggleCamera}
          showChat={showChat}
          setShowChat={setShowChat}
          handleLeave={handleLeave}
          id={id}
          isSharing={isSharing}
          startScreenShare={startScreenShare}
          stopScreenShare={stopScreenShare}
        />
      </div>

      {/* chatSidebar */}
      <div
        className={`transition-all duration-300 ease-in-out border-l border-white/10 bg-slate-900 shadow-xl overflow-hidden 
        ${showChat ? "w-80 opacity-100" : "w-0 opacity-0 border-none"}`}
      >
        <ChatSidebar
          messages={messages}
          currentMessage={currentMessage}
          setCurrentMessage={setCurrentMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
}

export default MeetingRoom;