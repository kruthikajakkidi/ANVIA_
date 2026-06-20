import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();

  const isAdmin = user?.role === "ADMIN";
  const isVolunteer = user?.role === "VOLUNTEER";

  function isActive(path) {
    return location.pathname === path;
  }

  function navClass(path) {
    return isActive(path)
      ? "bg-[#D89C1D] text-black px-3 py-1 rounded-lg font-semibold"
      : "hover:text-[#D89C1D] transition";
  }

  function sectionNavClass(sectionId) {
    return location.hash === `#${sectionId}` || location.pathname === `/${sectionId}`
      ? "bg-[#D89C1D] text-black px-3 py-1 rounded-lg font-semibold"
      : "hover:text-[#D89C1D] transition";
  }

  function goToSection(sectionId) {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: "smooth" });
      }, 80);
      return;
    }

    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
    });
  }

  function handleContact() {
    navigate("/feedback");
  }

  // NEW DONATE NAVIGATION
  function handleDonate() {
    if (isAdmin) return;
    navigate("/donate");
  }

  function handleLogout() {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    logout();
    navigate("/");
  }

  return (
    <nav className="bg-[#264f37] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-4">
          <img
            src="/images/logo.png"
            alt="ANVIA Logo"
            className="w-14 h-14 rounded-full object-cover"
          />

          <div className="mt-1">
            <h1 className="text-2xl font-bold tracking-wide text-[#D89C1D]">
              ANVIA
            </h1>

            <p className="text-xs sm:text-sm leading-tight">
              Animal Network for Volunteer Intervention & Aid
            </p>
          </div>
        </Link>

        {/* Desktop Navbar */}
        <div className="hidden md:flex items-center gap-8">

          <div className="flex items-center justify-end gap-6 flex-1">

            <Link to="/" className={navClass("/")}>
              Home
            </Link>

            {!isAdmin && !isVolunteer && (
              <button
                onClick={() => goToSection("about")}
                className={sectionNavClass("about")}
              >
                About
              </button>
            )}

            {isVolunteer && (
              <Link to="/volunteer" className={navClass("/volunteer")}>
                Rescues
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className={navClass("/admin/dashboard")}
              >
                Dashboard
              </Link>
            )}

            {!isAdmin && !isVolunteer && (
              <button
                onClick={handleContact}
                className={navClass("/feedback")}
              >
                Contact Us
              </button>
            )}

            {!isAuthenticated && (
              <Link to="/login" className={navClass("/login")}>
                Login
              </Link>
            )}

            {!isAuthenticated && (
              <Link to="/signup" className={navClass("/signup")}>
                Signup
              </Link>
            )}

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="hover:text-red-300 transition"
              >
                Logout
              </button>
            )}
          </div>

         {!isAdmin && (
            <button
              onClick={handleDonate}
              className={`px-5 py-2 rounded-xl font-semibold transition ${
                location.pathname.startsWith("/donate")
                  ? "bg-[#D89C1D] text-black"
                  : "bg-white text-[#355C46] hover:opacity-90"
              }`}
            >
              Donate
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden px-6 pb-4 flex flex-wrap gap-4 text-sm">

        <Link to="/" className={navClass("/")}>
          Home
        </Link>

        {!isAdmin && !isVolunteer && (
          <button onClick={() => goToSection("about")} className={sectionNavClass("about")}>
            About
          </button>
        )}

        {isVolunteer && (
          <Link to="/volunteer" className={navClass("/volunteer")}>
            Rescues
          </Link>
        )}

        {isAdmin && (
          <Link
            to="/admin/dashboard"
            className={navClass("/admin/dashboard")}
          >
            Dashboard
          </Link>
        )}

        {!isAdmin && !isVolunteer && (
          <button onClick={handleContact} className={navClass("/feedback")}>
            Contact Us
          </button>
        )}

        {!isAdmin && (
          <button
            onClick={handleDonate}
            className="bg-white text-[#355C46] px-3 py-1 rounded-lg font-semibold"
          >
            Donate
          </button>
        )}

        {!isAuthenticated && (
          <Link to="/login" className={navClass("/login")}>
            Login
          </Link>
        )}

        {!isAuthenticated && (
          <Link to="/signup" className={navClass("/signup")}>
            Signup
          </Link>
        )}

        {isAuthenticated && (
          <button onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;