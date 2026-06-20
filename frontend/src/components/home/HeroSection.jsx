import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function HeroSection() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const isVolunteer = isAuthenticated && user?.role === "VOLUNTEER";

  function goVolunteer() {
    if (isAuthenticated) {
      navigate("/volunteer");
    } else {
      navigate("/login", {
        state: { from: { pathname: "/volunteer" } },
      });
    }
  }

  return (
    <section
      className="
      h-screen
      bg-[url('/images/hero-animal.png')]
      bg-cover
      bg-center_30%
      relative
      overflow-hidden"
    >

      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20" />

      {/* LIVE STATUS BADGE */}
      <div className="absolute top-28 left-6 sm:left-10 z-10 flex items-center gap-2 bg-black/40 backdrop-blur-sm border border-white/20 rounded-full pl-3 pr-4 py-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D89C1D] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D89C1D]" />
        </span>
        <span className="text-white text-xs font-semibold uppercase tracking-wider">
          Live Rescue Network
        </span>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-6xl px-6 sm:px-10">

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight">
            Saving Animals
            <br />
            Through Community Action
          </h1>

          <p className="text-gray-200 mt-6 max-w-2xl text-lg leading-8">
            ANVIA helps citizens, volunteers and donors work together to
            rescue injured stray animals faster and more effectively.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/create-rescue")}
              className="bg-[#D89C1D] text-black px-8 py-3.5 rounded-xl font-semibold hover:opacity-90 transition"
            >
              Report Rescue
            </button>

            {!isVolunteer && (
              <button
                onClick={goVolunteer}
                className="bg-white/10 border-2 border-white text-white px-8 py-3.5 rounded-xl font-semibold backdrop-blur-sm hover:bg-white hover:text-[#355C46] transition"
              >
                Become Volunteer
              </button>
            )}
          </div>

        </div>
      </div>

    </section>
  );
}

export default HeroSection;