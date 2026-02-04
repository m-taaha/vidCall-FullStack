import React from 'react'
import {
  FaVideo,
  FaVideoSlash,
  FaMicrophoneSlash,
  FaMicrophone,
  FaMessage,
  FaDesktop,
} from "react-icons/fa6";

export default function ControlBar({
  audio,
  setAudio,
  camera,
  setCamera,
  showChat,
  setShowChat,
  handleLeave,
  id,
  isSharing,
  startScreenShare,
  stopScreenShare,
}) {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 to-transparent z-10">
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

          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-3 rounded-xl transition-all ${showChat ? "bg-blue-600" : "bg-slate-800"}`}
          >
            <FaMessage size={20} />
          </button>

          <button
            onClick={isSharing ? stopScreenShare : startScreenShare}
            className={`p-3 rounded-xl transition-all ${
              isSharing ? "bg-blue-600" : "bg-slate-800 hover:bg-slate-700"
            }`}
          >
            <FaDesktop size={20} />
          </button>
        </div>

        {/* room actions  */}
        <button
          onClick={handleLeave}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-red-500/20"
        >
          Leave
        </button>
      </div>
    </div>
  );
}
