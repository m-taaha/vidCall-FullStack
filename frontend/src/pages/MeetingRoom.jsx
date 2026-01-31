import React, { useEffect, useRef, useState } from 'react'
import { useMeeting } from '../context/MeetingContext'
import {
  FaVideo,
  FaVideoSlash,
  FaMicrophoneSlash,
  FaMicrophone,
} from "react-icons/fa6";
import { useNavigate, useParams } from 'react-router-dom';
import {io} from "socket.io-client";
import Peer from 'simple-peer';
import Video from '../components/Video';

// Helper for when YOU are the caller 
// We pass socketRef so the peer can send its "business card" (signal) to the server
function createPeer(userToSignal, callerId, stream, socketRef) {
  const peer = new Peer({
    initiator: true, // You start the handshake
    trickle: false,
    stream,
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
  const {audio, setAudio, camera, setCamera} = useMeeting();
  const [peers, setPeers] = useState([]);
  const videoRef = useRef(null);
  const socketRef = useRef();
  const peersRef = useRef([]); 
  const {id} = useParams();
  const [stream, setStream] = useState(null)
  const navigate = useNavigate();
  // meeting constraints
  const constraints = {
    video: camera, 
    audio: audio
  }

  //logic to handle user media (CAmera/Mic)
  useEffect(() => {
    let localStream;
    const startStream = async() => {
      try{
        localStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(localStream)

        if(videoRef.current) {
          videoRef.current.srcObject = localStream;
        }
      }catch (error) {
        console.error("Error in accessing media devices", error)
      }
    };

    startStream();


    // clearn up
    return () => {
      if(localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [])



  // track syncning logic
  useEffect(() => {
    if(stream) {
      stream.getVideoTracks().forEach((track) => (track.enabled = camera));
      stream.getAudioTracks().forEach((track) => (track.enabled = audio))
    }
  }, [camera, audio, stream]);


// main signalling effect
    // here we are handling how are we going to manage members - suppose there are already 3 members in the meaning then you joined - then this function will loop through the existing socket id's present in the connection and make a call to all of them one by one - then when you entered once - after you a new user came and entered then here you and the other users present in the connection or meeting will acts as reciever and the new user will act like a caller
  useEffect(() => {
    if(!stream) return; //wait until local camera is ready


    // initialize the connection backend port 
    socketRef.current = io("http://localhost:8000");
    
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
    socketRef.current.emit("User Joined", id);

// cleanup: disconnect when the component unmounts
    return () => {
      socketRef.current.disconnect();
    }

  }, [id, stream]);


  // handleLeave
  const handleLeave = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 pb-32">
      {/* main video grid */}
      <div
        className={`grid gap-4 h-[calc(100vh-160px)] w-full max-w-7xl mx-auto 
        ${/* we will add dynamically cahnge this later, but for now; */ "grid-cols-1 md:grid-cols-2"}`}
      >
        {/* local video tile (host- you) */}
        <div className="relative bg-slate-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl group">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover -scale-x-100" //mirrors my own video
          />

          {/* overdflow for name/status */}
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop:blur-md px-3 py-1 rounded-lg text-sm border border-white/10">
            You
          </div>

          {/* if camera is off, show placeholder */}
          {!camera && (
            <div className='absolute inset-0 flex items-center justify-center bg-slate-800'>
              <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center text-3xl font-bold">
                U
              </div>
            </div>
          )}
        </div>

        {/* remote video placeholder (wait for person 2)  */}
        <div className='relative bg-slate-900 rounded-3xl border border-dashed border-white/20 flex items-center justify-center text-slate-500'>
          <div className='text-center'>
            <p className='animate-pulse'>
              {peers.map((peerObj) => {
                <Video key={peerObj.peerID} peer={peerObj.peer} />
              })}
            </p>
            
            <p className='text-xs mt-2 font-mono text-slate-600'>
              ID: {id}
            </p>
          </div>
        </div>
      </div>

      {/* control bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 to-transparent">
        <div className="max-w-4xl mx-auto flex items-center justify-between bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl">
          {/* meeting info (left) */}
          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-400">
              Meeting ID: <span className="text-blue-400 uppercase">{id}</span>
            </p>
          </div>

          {/* Primary controls  */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setAudio(!audio)}
              className={`p-3 rounded-xl transition-all ${audio ? "bg-slate-800 hover:bg-slate-700" : "bg-red-500 hover:bg-red-600 text-white"}`}
            >
              {audio ? (
                <FaMicrophone size={20} />
              ) : (
                <FaMicrophoneSlash size={20} />
              )}
            </button>

            <button
              onClick={() => setCamera(!camera)}
              className={`p-3 rounded-xl transition-all ${camera ? "bg-slate-800 hover:bg-slate-700" : "bg-red-500 hover:bg-red-600 text-white"}`}
            >
              {camera ? <FaVideo size={20} /> : <FaVideoSlash size={20} />}
            </button>

            {/* TODO: ADD screen share button here later */}
          </div>

          {/* room actions  */}
          <div>
            {/* TODO: CHAT button here later */}
            <button
              onClick={handleLeave}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-red-500/20"
            >
              Leave
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeetingRoom;