import React, { useEffect, useRef, useState } from 'react'
import { useMeeting } from '../context/MeetingContext'
import {
  FaVideo,
  FaVideoSlash,
  FaMicrophoneSlash,
  FaMicrophone,
} from "react-icons/fa6";
import { useNavigate, useParams } from 'react-router-dom';

function MeetingRoom() {
  const {audio, setAudio, camera, setCamera} = useMeeting();
  const videoRef = useRef(null);
  const {id} = useParams();
  const [stream, setStream] = useState(null)
  const navigate = useNavigate();
  // meeting constraints
  const constraints = {
    video: camera, 
    audio: audio
  }

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


  // handleLeave
  const handleLeave = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="aspect-video bg-slate-900 rounded-2xl border border-white/10 overflow-hidden relative shadow-2xl">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
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
            className='bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-red-500/20'
            >
              Leave
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeetingRoom