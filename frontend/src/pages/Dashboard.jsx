import React from 'react'
import { AuthContext, useAuth } from '../context/AuthContext'

function Dashboard() {
    const {user, logout} = useAuth();
    // handleLogout
    const handleLogout = () => {
      logout()
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
        <header className='h-16 border-b border-white/10 flex items-center justify-between px-8'>
          <h2 className="text-lg font-medium text-slate-400">
            Welcome back,{" "}
            <span className="text-white font-bold">{user?.name}</span>!
          </h2>

          <button 
          onClick={handleLogout}
          className='border border-red-500/50 text-red-500  hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg transition-all active:scale-95 font-medium '>
            Logout
          </button>
        </header>


        {/* dashboard content */}
        <section className='flex-1 p-8 overflow-y-auto'>
            {/* We'll place the New Meeting and JOin section here */}


        </section>
      </main>
    </div>
  );
}

export default Dashboard