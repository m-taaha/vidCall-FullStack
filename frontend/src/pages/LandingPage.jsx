import React from "react";
import { Link } from "react-router-dom";
function LandingPage() {
  return (
    <div className="relative h-screen flex flex-col text-white">
      {/* Background video (full-bleed) */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/bgimg.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      {/* dark overlay to improve contrast */}
      <div className="absolute inset-0 bg-black/60" aria-hidden />

      {/* Navbar */}
      <nav className="relative z-20 flex justify-between items-center px-8 py-6">
        <h2 className="font-extrabold text-3xl tracking-wide cursor-pointer">
          vidCall
        </h2>
        <div className="flex gap-6 items-center font-medium text-lg ">
          <button className="hover:text-indigo-400 transition cursor-pointer">
            Join as Guest
          </button>
          <button className="hover:text-indigo-400 transition cursor-pointer">
            Register
          </button>
          <button className="bg-indigo-600 px-5 py-2 rounded-lg hover:bg-indigo-500 transition cursor-pointer">
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 w-full max-w-6xl">
          {/* Left: Text */}
          <div className="max-w-lg text-center md:text-left space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Meet with your <span className="text-indigo-500">friends</span>
            </h1>
            <p className="text-lg text-gray-300">
              The all-in-one platform for{" "}
              <span className="text-indigo-400">video calls</span> and
              <span className="text-indigo-400"> chatting</span> — fast, simple,
              and secure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center md:justify-start">
              <Link
                to={"/home"}
                className="bg-indigo-600 px-6 py-3 rounded-lg font-semibold
                hover:bg-indigo-500 transition"
              >
                Get Started
              </Link>
              <button className="border border-indigo-400 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-400 hover:text-white transition">
                Learn More
              </button>
            </div>
          </div>

          {/* Right: Image */}
          <div className="w-full max-w-md">
            <img
              src="/images/landingPage.webp"
              alt="Landing"
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-4 text-gray-300 text-sm border-t border-gray-800">
        © 2025 vidCall. All rights reserved.
      </footer>
    </div>
  );
}

export default LandingPage;
