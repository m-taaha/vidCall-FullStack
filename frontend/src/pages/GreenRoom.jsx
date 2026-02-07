import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  FaVideo,
  FaVideoSlash,
  FaMicrophone,
  FaMicrophoneSlash,
} from "react-icons/fa6";
import { useMeeting } from '../context/MeetingContext';


function GreenRoom() {
  const navigate = useNavigate();
  // destructure the 'id' property from useParams
  const {id} = useParams();
  //using meetingContext 
  const { audio, setAudio, camera, setCamera } = useMeeting();

  // this ref will hold our video element
  const videoRef = useRef(null);

  //navigator.mediaDevices.getUserMedia() - this pops up the familiar permission request at the top of the screen asking to allow the use of camera and mic -
  // since the function will return stream - means - continours flow of data (video frames and audio samples) coming straight from the hardware so we set **"constraints" object**
  const constraints = {
    video: true, 
    audio: true
  }

  const [stream, setStream] = useState(null); //to manipulate the stream - like when user leaves or toggle 

  // initial setup : request media
  useEffect(() => {
    let localStream; 
    const startStream = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(localStream);

        if (videoRef.current) {
          videoRef.current.srcObject = localStream;
        }
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    };

    startStream();
    
    // clean up --- Stopping the Tracks. Every mediaStream object has a method called getTracks() that returns an array of all active tracks (like your video and audio).
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [])


  // handling the tracks using .enabled property - to match the toggling of the state of audio and video basically --
// mathcing hardware to button state
useEffect(() => {
  // only proceed if stream is not null
  if(stream) {
    stream.getVideoTracks().forEach((track) => (track.enabled = camera));
    stream.getAudioTracks().forEach((track) => (track.enabled = audio));
  }

  // clean up function
  return () => {
    if(stream) {
      stream.getTracks().forEach((track) => {
        console.log("GreenRoom cleanup: Stopping track", track.kind);
        track.stop();
      });
    }
  }
}, [camera, audio, stream]); 


// toggleCamera - handle hardware and stop track
const toggleCamera = async () => {
  if(camera) {
    // currently ON - turning off
    // need to stop the harware here so that the green light goes off
    if(stream) {
      stream.getVideoTracks().forEach(track => track.stop());
    }
    setCamera(false);
  } else {
    // currently OFF - turning on
    //  should fetch a BRAND NEW stream here so that the camera screen doesn't go blank when i start streaming again through my camera
    try {
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);

      setStream(newStream)
      if(videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setCamera(true);

    } catch(error) {
      console.error("Failed to restart camera", error);
    }
  }
}

// handleJoin
const handleJoin = () => {
  navigate(`/meeting-room/${id}`);
}




  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-3xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Ready to join?</h1>
          <p className="text-slate-400">
            Meeting ID: <span className="text-blue-400 font-mono">{id}</span>
          </p>
        </div>

        {/* Video preview container */}
        <div className="aspect-video bg-slate-900 rounded-2xl border border-white/10 overflow-hidden relative shadow-2xl">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted //muted teh preview to prevent feeback loops!
            className="w-full h-full object-cover"
          />

          {!camera && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm">
              <div className="text-center">
                <FaVideoSlash className="text-5xl text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400">Your camera is off</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {/* audio button */}
          <button
            onClick={() => setAudio(!audio)}
            className={`p-4 rounded-full transition-all ${audio ? `bg-slate-800 hover:bg-slate-700` : `bg-red-500 hover:bg-red-600`}`}
          >
            {audio ? (
              <FaMicrophone size={24} />
            ) : (
              <FaMicrophoneSlash size={24} />
            )}
          </button>

          {/* camera button */}
          <button
            className={`p-4 rounded-full transition-all ${camera ? "bg-slate-800 hover:bg-slate-700" : "bg-red-500 hover:bg-red-600"}`}
            onClick={() => setCamera(toggleCamera)}
          >
            {camera ? <FaVideo size={24} /> : <FaVideoSlash size={24} />}
          </button>

          {/* join button */}
          <button className="bg-blue-600 hover:bg-blue-500 px-10 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          onClick={handleJoin}
          >
            Join Meeting
          </button>
        </div>
      </div>
    </div>
  );
}

export default GreenRoom