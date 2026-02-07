import React, { useState } from 'react'
import { AuthContext, useAuth } from '../context/AuthContext'
import { generateRoomId } from '../utils/roomUtils';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();
    const {user, logout} = useAuth();
    const [joinString, setJoinString] = useState("");

    // handleLogout
    const handleLogout = () => {
      logout()
      navigate("/")
    }

    // tracking join string input field
    const handleJoinString = (e) => {
      const string = e.target.value

      setJoinString(string)
    }

    // handleStartMeeting
    const handleStartMeeting = () => {
      const id = generateRoomId();
      navigate(`/green-room/${id}`)
    }

    // handleJoinMeeting
    const handleJoinMeeting = () => {
      if(!joinString){
        alert("Meeting code can not be empty.!")
      } else if (joinString.length !== 10) {
        alert("Meeting length should be of 10 characters")
      } else {
        navigate(`/green-room/${joinString}`)
      }
    }



  return (
    <div className="flex h-screen bg-slate-950 text-white">
      {/* sidebar container */}
      <aside className="w-64 border-r border-white/10 flex flex-col">
        <div className="p-6 text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          vidCALL
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {/* we'll add sidebar links here */}
          <div className="p-3 rounded-lg bg-blue-600/20 text-blue-400 font-medium cursor-pointer">
            Meetings
          </div>
          <div className="p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer text-slate-400 ">
            History
          </div>
        </nav>
      </aside>

      {/* main content area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8">
          <h2 className="text-lg font-medium text-slate-400">
            Welcome back,{" "}
            <span className="text-white font-bold">{user?.name}</span>!
          </h2>

          <button
            onClick={handleLogout}
            className="border border-red-500/50 text-red-500  hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg transition-all active:scale-95 font-medium "
          >
            Logout
          </button>
        </header>

        {/* dashboard content */}
        <section className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {/* card 1: for new meeting */}
            <div className="p-8 rounded-3xl bg-blue-600 flex flex-col justify-between hover:bg-blue-700 transition-all cursor-pointer">
              <div>
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  {/* TODO: a video icon here  */}
                  🎥
                </div>

                <h3 className="text-2xl font-bold mb-2">New Meeting</h3>
                <p className="text-blue-100">
                  Setup a new meeting link instantly and invite
                </p>
              </div>

              <button
                className="mt-8 bg-white text-blue-600 font-bold py-3 rounded-xl active:scale-95 transition-transform"
                onClick={handleStartMeeting}
              >
                Start Meeting
              </button>
            </div>

            {/* card 2: for join meeting  via code*/}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-xl">
                  ⌨️
                </div>

                <h3 className="text-2xl font-bold mb-2">Join Meeting</h3>
                <p className="text-slate-400">
                  Enter a 10-character code provided by the host.
                </p>
              </div>

              <div className="mt-8 flex gap-2">
                <input
                  type="text"
                  value={joinString}
                  placeholder="Enter room code"
                  className="flex-1 bg-white/5  border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                  onChange={handleJoinString}
                />

                <button 
                onClick={handleJoinMeeting}
                className="bg-white/10 hover:bg-white/20 px-6 rounded-xl font-bold transition-colors active:scale-95">
                  Join
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard