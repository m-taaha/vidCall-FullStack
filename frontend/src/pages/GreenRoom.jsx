import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'


function GreenRoom() {
  // destructure the 'id' property from useParams
  const {id} = useParams();
  const [audio, setAudio] = useState(true);
  const [camera, setCamera] = useState(true);
  
  // this ref will hold our video element
  const videoRef = useRef(null);

  //navigator.mediaDevices.getUserMedia() - this pops up the familiar permission request at the top of the screen asking to allow the use of camera and mic -
  // since the function will return stream - means - continours flow of data (video frames and audio samples) coming straight from the hardware so we set **"constraints" object**
  const constraints = {
    video: true, 
    audio: true
  }

  const [stream, setStream] = useState(null); //to manipulate the stream - like when user leaves or toggle 

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




  return (
    <div className='min-h-screen bg-slate-950 text-white p-8'>
      <h1 className='text-3xl font-bold mb-4'>Green Room</h1>
        <p>
          Meeting ID: <span className='text-blue-400 font-mono'>{id}</span>
        </p>


        {/* TODO: will build the preview and controls here */}
        <div className='max-w-2xl mx-auto aspect-video bg-slate-900 rounded-2xl border border-white/10 overflow-hidden relative'>
          <video
          ref={videoRef}
          autoPlay
          playsInline
          muted //muted teh preview to prevent feeback loops!
          className='w-full h-full object-cover'
          />

          { !camera && (
            <div className='absolute inset-0 flex items-center justify-center bg-slate-900'>
              <p className='text-slate-500'>Camera is turned off</p>
            </div>
          )}
        </div>


        {/* TODO: add the join button and toggle switches below this  */}
    </div>
  )
}

export default GreenRoom