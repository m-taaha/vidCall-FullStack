import React from 'react'

function Navbar() {
  return (
    //
    <nav className=" bg-slate-950 border-b border-white/10 py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between ">
        {/* left side */}
        <div className="text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          vidCALL
        </div>

        {/* right side */}
        <div className=" text-white gap-6  flex items-center font-medium">
          <button className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-lg font-bold transition-all active:scale-95 shadow-lg shadow-blue-500/20">
            Join as Guest
          </button>
          <button className="hover:text-blue-400 transition-colors">
            Register
          </button>
          <button className="hover:text-blue-400 transition-colors">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar