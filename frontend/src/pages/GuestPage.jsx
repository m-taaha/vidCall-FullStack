import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function GuestPage() {
  const [guestName, setGuestName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  // handlejoinMeeting
  const handleJoinMeeting = () => {

    if(!guestName.trim()) {
      alert("Please enter your name to join the call.");
      return;
    }
    if(!roomCode) {
      alert("Enter Room code");
    } else if (roomCode.length !== 10) {
      alert("Room code must be of 10 characters")
    } else {
      navigate(`/green-room/${roomCode}`, {state: { name: guestName.trim()} }
      )
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      {/* Guest info card */}
      <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl">
        {/* header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text  text-transparent">
            Join as Guest
          </h1>

          <p className="text-slate-400 mt-2">
            Enter your details to join the call
          </p>

          <div className="space-y-2">
            {/* name input  */}
            <label className="text-sm font-medium text-slate-400 ml-1">
              Your Name
            </label>
            <input
              type="text"
              placeholder="e.g. Spidy"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
            />
          </div>

          {/* room code */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400 ml-1">
              Room Code
            </label>
            <input
              type="text"
              placeholder="Enter 10-character code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600 uppercase tracking-widest"
            />
          </div>

          {/* join Button */}
          <button
          onClick={handleJoinMeeting}
          className='w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-600/20 mt-4'
          >
            Join Meeting 
          </button>
        </div>
      </div>
    </div>
  );
}

export default GuestPage