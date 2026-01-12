import Navbar from "../components/Navbar"
import {Link} from "react-router-dom"

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 ">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-12 ">
        {/* hero section */}
        {/* left side  */}
        <div className="lg:w-1/2 text-left">
          <section className="max-w-7xl mx-auto px-6 py-20 text-left text-white">
            <h1 className="text-6xl font-extrabold">
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Connect{" "}
              </span>
              with your loved Ones
            </h1>

            <h3 className="text-xl text-slate-400 mb-6">
              Cover a distance with
              <span className="font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                {" "}
                vidCALL
              </span>
            </h3>



            {/* CTA's call to action  */}
            <Link
              to={"/user-auth"}
              className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-lg font-bold transition-all active:scale-95 shadow-lg shadow-blue-500/20"
            >
              Get Started
            </Link>
          </section>
        </div>


        {/* right side */}
        <div className="lg:w-1/2 text-right">
            {/* TODO: adding a picture of the app */}

            <div className="bg-white/10 backdrop-blur-md border-white/20 rounded-2xl  h-[400px] w-full shadow-2xl">
                
                {/* TODO: a fake video i'll put here */}
            </div>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
