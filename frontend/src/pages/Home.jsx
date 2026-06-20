import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/home/HeroSection";
import AboutSection from "../components/home/AboutSection";
import StatsSection from "../components/home/StatsSection";
import SuccessStories from "../components/home/SuccessStories";
import ContactSection from "../components/home/ContactSection";
import Footer from "../components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaPaw } from "react-icons/fa";

function HomeActionSections() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const isVolunteer = isAuthenticated && user?.role === "VOLUNTEER";

  function goDonate() {
    document
      .getElementById("donate")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  function reportEmergency() {
    navigate("/login", {
      state: {
        from: {
          pathname: "/create-rescue?type=emergency",
        },
      },
    });
  }

  function contactNow() {
    navigate("/feedback");
  }

  function goVolunteer() {
    if (isAuthenticated) {
      navigate("/volunteer");
    } else {
      navigate("/login", {
        state: {
          from: {
            pathname: "/volunteer",
          },
        },
      });
    }
  }

  return (
    <section className="py-24 bg-[#F5F3EE] relative overflow-hidden">

      {/* Soft background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-white blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
        <div className="text-center max-w-4xl mx-auto">
          <p className="text-[#D89C1D] font-semibold uppercase tracking-wider text-sm">
            City Rescue Network
          </p>

          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#355C46] leading-tight">
            Report, Claim &amp; Support Animal Rescue Cases
          </h2>

          <div className="mt-5 w-16 h-1.5 bg-[#D89C1D] rounded-full mx-auto" />

          <p className="mt-5 text-lg text-gray-600">
            Connect injured animals with rescuers, volunteers and donors
            in real time.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-5 mt-12 max-w-4xl mx-auto">

          {/* REPORT RESCUE CARD */}
          <div className="group bg-white rounded-xl overflow-hidden shadow-md border border-[#D1CEC5] hover:-translate-y-1 hover:shadow-xl transition-all duration-300 max-w-xs mx-auto lg:max-w-none">

            <div className="relative h-50 w-full overflow-hidden">
              <img
                src="/images/report-rescue.jpg"
                alt="Report Rescue"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D89C1D] opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#D89C1D]" />
                </span>
                Urgent Cases
              </span>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-bold text-[#355C46] leading-snug">
                Found an Injured or Abandoned Animal?
              </h3>

              <p className="mt-2 text-sm text-gray-600 leading-5">
                Share photos and live location details so the ANVIA rescue
                network can respond quickly and provide immediate help.
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={reportEmergency}
                  className="bg-[#355C46] text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:opacity-90 transition"
                >
                  Report Rescue
                </button>

                <button
                  onClick={contactNow}
                  className="border-2 border-[#355C46] text-[#355C46] px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-[#355C46] hover:text-white transition"
                >
                  Contact ANVIA
                </button>
              </div>
            </div>
          </div>

          {/* GET INVOLVED CARD */}
          <div className="group bg-white rounded-xl overflow-hidden shadow-md border border-[#D1CEC5] hover:-translate-y-1 hover:shadow-xl transition-all duration-300 max-w-xs mx-auto lg:max-w-none">

            <div className="relative h-50 w-full overflow-hidden">
              <img
                src="/images/get-involved.jpg"
                alt="Get Involved"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full">
                <FaPaw size={10} className="text-[#D89C1D]" />
                Join the Network
              </span>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-bold text-[#355C46]">
                Get Involved
              </h3>

              <p className="mt-2 text-sm text-gray-600 leading-5">
                Volunteers can claim rescue requests nearby while donors
                directly support verified animal rescue and treatment cases.
              </p>

              <div className={`grid gap-2 mt-3 ${isVolunteer ? "grid-cols-1" : "sm:grid-cols-2"}`}>
                {!isVolunteer && (
                  <button
                    onClick={goVolunteer}
                    className="bg-[#355C46] text-white rounded-lg p-2.5 text-left hover:opacity-90 transition"
                  >
                    <div className="font-bold text-sm">
                      Volunteer
                    </div>

                    <span className="block mt-1 text-xs text-gray-200">
                      Join rescue missions and help animals in need
                    </span>
                  </button>
                )}

                <button
                  onClick={goDonate}
                  className="bg-[#D89C1D] text-black rounded-lg p-2.5 text-left hover:opacity-90 transition"
                >
                  <div className="font-bold text-sm text-center">
                    Donate
                  </div>

                  <span className="block mt-1 text-xs text-[#3D2E08] text-center">
                    Support verified rescue and treatment cases
                  </span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
function DonateSection() {
  return (
    <section id="donate" className="py-24 bg-white scroll-mt-24 relative overflow-hidden">

      {/* Soft background accent */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#F5F3EE] blur-3xl opacity-70 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-14 items-center relative">

        <div>
          <p className="text-[#D89C1D] font-semibold uppercase tracking-wider text-sm">
            Donate
          </p>

          <h2 className="mt-3 text-4xl md:text-5xl font-bold text-[#355C46] leading-tight">
            Support Rescues Through Direct Giving
          </h2>

          <div className="mt-6 w-16 h-1.5 bg-[#D89C1D] rounded-full" />

          <p className="mt-6 text-gray-600 leading-8 text-lg">
            Scan the code to contribute directly. Every donation goes toward
            verified rescue, treatment, and recovery cases handled by our
            volunteer network.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-6 border-t border-[#D1CEC5] pt-6">
            <div>
              <p className="text-2xl font-bold text-[#355C46]">100%</p>
              <p className="mt-1 text-sm text-gray-500">Goes to rescues</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#355C46]">Secure</p>
              <p className="mt-1 text-sm text-gray-500">Verified cases only</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#355C46]">Instant</p>
              <p className="mt-1 text-sm text-gray-500">Scan & give</p>
            </div>
          </div>
        </div>

      <div className="relative">
          <div className="absolute -inset-3 border-2 border-[#D89C1D] rounded-3xl -rotate-2" />
          <div className="relative bg-[#F5F3EE] border-2 border-dashed border-[#D89C1D] rounded-2xl min-h-96 flex items-center justify-center text-center p-10">
            <div>
              <p className="text-3xl font-bold text-[#355C46] mb-4">
                Scan to Donate
              </p>

              <div className="mx-auto w-48 h-48 bg-white rounded-2xl shadow-inner border border-[#D1CEC5] flex items-center justify-center text-[#355C46] font-bold">
                <img
                  src="/images/qr-scanner.png"
                  alt="Scan to donate"
                  className="w-full h-full object-contain p-3"
                />
              </div>

              <p className="mt-4 text-sm text-gray-600 italic max-w-xs mx-auto">
                "Every scan is a second chance for an animal in need."
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user?.role === "ADMIN") {
    return (
      <div>
        <Navbar />
        <section className="min-h-screen bg-[#F5F3EE] flex items-center justify-center px-6 relative overflow-hidden">

          {/* Soft background accent */}
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white blur-3xl opacity-60 pointer-events-none" />

          <div className="bg-white rounded-2xl shadow-xl border border-[#D1CEC5] p-10 lg:p-12 text-center max-w-2xl relative">
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#355C46]/10 text-[#355C46] mb-2">
              <FaPaw size={22} />
            </span>

            <p className="text-[#D89C1D] font-semibold uppercase tracking-wider text-sm">
              Animal Network for Volunteer Intervention &amp; Aid
            </p>

            <h1 className="mt-4 text-4xl md:text-5xl font-bold text-[#355C46] leading-tight">
              Admin Home
            </h1>

            <div className="mt-5 w-16 h-1.5 bg-[#D89C1D] rounded-full mx-auto" />

            <p className="mt-6 text-gray-600 leading-7">
              Review volunteers, donors, rescue cases, and live volunteer
              locations from the dashboard.
            </p>

            <button
              onClick={() => navigate("/admin/dashboard")}
              className="mt-8 bg-[#355C46] text-white px-8 py-3.5 rounded-xl font-semibold hover:opacity-90 transition"
            >
              Open Dashboard
            </button>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <HeroSection />
      <HomeActionSections />
      <SuccessStories />
      <AboutSection />
      <StatsSection />
      <DonateSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default Home;

