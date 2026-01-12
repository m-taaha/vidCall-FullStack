import React, { useState } from 'react'

function Authentication() {
    const [isLogin, setIsLogin] = useState(true); 


  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="bg-white/5 border border-white/10 p-8 rounded-2xl w-full max-w-md backdrop:blur-lg">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">
          {isLogin === true ? "Welcome Back" : "Create Account"}
        </h2>

        <p className="text-slate-400 text-center mb-8">
          {isLogin === true ? "Login to start calling" : "Join vidCALL today"}
        </p>

        {/* form  */}
        <form className="space-y-4">
          {/* only show for register */}
          {!isLogin && (
            <>
              <div className="flex w-full gap-2">
                {/* First Name Container */}
                <div className="flex flex-col flex-1 gap-1">
                  <label
                    htmlFor="firstName"
                    className="text-sm text-slate-400 ml-1"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    className="w-full rounded-lg px-4 py-3 bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-all text-white"
                    placeholder="First Name"
                  />
                </div>

                {/* Last Name Container */}
                <div className="flex flex-col flex-1 gap-1">
                  <label
                    htmlFor="lastName"
                    className="text-sm text-slate-400 ml-1"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    className="w-full rounded-lg px-4 py-3 bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-all text-white"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              {/* username container */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="userName"
                  className="text-sm text-slate-400 ml-1"
                >
                  Username
                </label>
                <input
                  id="userName"
                  className="w-full rounded-lg px-4 py-3 bg-white/5 border border-white/10 focus:border-blue-500 focus:oultine-none transition-all text-white"
                  placeholder="Username"
                />
              </div>
            </>
          )}

          {/* shared fields (always show) */}
           {/* email container */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm text-slate-400 ml-1">
              Email
            </label>
            <input
              id="email"
              className="w-full rounded-lg px-4 py-3 bg-white/5 border border-white/10 focus:border-blue-500 focus:oultine-none transition-all text-white"
              placeholder="spidy@example.com"
            />
          </div>

          {/* password container */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm text-slate-400 ml-1">
              Password
            </label>
            <input
              id="password"
              className="w-full rounded-lg px-4 py-3 bg-white/5 border border-white/10 focus:border-blue-500 focus:oultine-none transition-all text-white"
              placeholder="Password"
            />
          </div>

          {/* Obly show for register */}
          {!isLogin && (
            <div className="flex flex-col gap-1">
                {/* confirm password container */}
              <label
                htmlFor="confirmPassword"
                className="text-sm text-slate-400 ml-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                className="w-full rounded-lg px-4 py-3 bg-white/5 border border-white/10 focus:border-blue-500 focus:oultine-none transition-all text-white"
                placeholder="Confirm Password"
              />
            </div>
          )}

          <button className="w-full bg-blue-600 hover:blue-700 text-white font-bold py-3 rounded-lg mt-6 transition-all active:scale-[0.98]">
            {isLogin ? "Login" : "Submit"}
          </button>
        </form>

        <button
          onClick={() => setIsLogin((prev) => !prev)}
          className="text-blue-400 mt-4 text-sm hover:underline w-full"
        >
          {isLogin
            ? "Need an account? Register"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}

export default Authentication