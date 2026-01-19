import React, { useEffect, useState } from 'react'
import { AuthContext, useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';


function Authentication() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? false : true;  //showing form according to the button
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(initialMode); 
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  // const [error, setError] = useState();

//using authcontext and destructuring the objects from authcontext -
    const {loading, register , login , user} = useAuth(AuthContext);

    // applying auth guard if a user is already logged in keep the user away from the logged in page or register 
    useEffect(() => {
      // only act if are not loading anymore
      if(!loading) {
        if(user) {
          // if user exists, send them to the dashboard
          navigate("/dashboard");
        }
      }
    }, [user, loading, navigate])


    // handle on change 
    const handleOnChange = (e) => {
        const {id , value} = e.target;

        setFormData(prev => ({
            ...prev, [id]: value
        }))
    }

    // handle submit
    const handleSubmit = async (e) => {
      e.preventDefault();

      // registeration and validation
      if(!isLogin) {
        if (formData.password !== formData.confirmPassword) {
          alert("Password do not match!");
          return;
        }

        const result = await register(formData);
        if (result.success) {
          setIsLogin(true); //switch to login
          alert("Registeration successful! Please login.");
        } 
      } else {
        // login logic
        const result = await login({
          email: formData.email,
          password: formData.password
        });
        
        if(result.success) {
          navigate("/dashboard")
        } else {
          alert(result.message);
        }
      }

    }



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
        <form className="space-y-4"
        onSubmit={handleSubmit}
        >
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
                    value={formData.firstName}
                    className="w-full rounded-lg px-4 py-3 bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-all text-white"
                    placeholder="First Name"
                    onChange={handleOnChange}
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
                    value={formData.lastName}
                    className="w-full rounded-lg px-4 py-3 bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-all text-white"
                    placeholder="Last Name"
                    onChange={handleOnChange}
                  />
                </div>
              </div>

              {/* username container */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="username"
                  className="text-sm text-slate-400 ml-1"
                >
                  Username
                </label>
                <input
                  id="username"
                  value={formData.username}
                  className="w-full rounded-lg px-4 py-3 bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-all text-white"
                  placeholder="Username"
                  onChange={handleOnChange}
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
              value={formData.email}
              className="w-full rounded-lg px-4 py-3 bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-all text-white"
              placeholder="spidy@example.com"
              onChange={handleOnChange}
            />
          </div>

          {/* password container */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm text-slate-400 ml-1">
              Password
            </label>
            <input
              id="password"
              type='password'
              value={formData.password}
              className="w-full rounded-lg px-4 py-3 bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-all text-white"
              placeholder="Password"
              onChange={handleOnChange}
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
                type='password'
                value={formData.confirmPassword}
                className="w-full rounded-lg px-4 py-3 bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-all text-white"
                placeholder="Confirm Password"
                onChange={handleOnChange}
              />
            </div>
          )}

          <button 
          disabled={loading} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-6 transition-all active:scale-[0.98]">
            {loading ? "Processing..." : (isLogin ? "Login" : "Submit")}
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