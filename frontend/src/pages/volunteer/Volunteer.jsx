import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { apiRequest, getUploadUrl } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { FaPaw, FaCheckCircle } from "react-icons/fa";

const statusTone = {
  PENDING: "text-yellow-700 bg-yellow-50 border-yellow-200",
  CLAIMED: "text-blue-700 bg-blue-50 border-blue-200",
  IN_PROGRESS: "text-orange-700 bg-orange-50 border-orange-200",
  COMPLETED: "text-green-700 bg-green-50 border-green-200",
};

const severityTone = {
  HIGH: "bg-red-600 text-white",
  MEDIUM: "bg-[#D89C1D] text-black",
  LOW: "bg-[#355C46] text-white",
};

function Volunteer() {
  const navigate = useNavigate();
  const { acceptAuthToken, user } = useAuth();
  const [ongoing, setOngoing] = useState([]);
  const [previous, setPrevious] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState("current");
  const [selectedRescue, setSelectedRescue] = useState(null);
  const [application, setApplication] = useState({
    phone: "",
    area: "",
    availability: "",
    pledge: false,
  });

  const isVolunteer = user?.role === "VOLUNTEER";
  const isUser = user?.role === "USER";

  const emergencyRescues = useMemo(
    () =>
      ongoing.filter((rescue) => {
        const severity = getSeverity(rescue);
        const type = String(rescue.type || rescue.rescueType || "").toUpperCase();
        return severity === "HIGH" || type.includes("EMERGENCY") || rescue.isEmergency;
      }),
    [ongoing]
  );

  const activeRescues =
    activeView === "current"
      ? ongoing
      : activeView === "emergency"
        ? emergencyRescues
        : previous;

  useEffect(() => {
    if (isVolunteer) {
      loadRescues();
    }
  }, [isVolunteer]);

  async function loadRescues() {
    setLoading(true);
    setMessage("");

    try {
      const [ongoingData, historyData] = await Promise.all([
        apiRequest("/volunteer/rescues"),
        apiRequest("/volunteer/history"),
      ]);

      setOngoing(ongoingData.payload || []);
      setPrevious(historyData.payload || []);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  function updateApplication(e) {
    const { name, type, checked, value } = e.target;

    setApplication((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function applyVolunteer(e) {
    e.preventDefault();
    setMessage("");

    if (!application.pledge) {
      setMessage("Please accept the volunteer pledge before submitting.");
      return;
    }

    setLoading(true);

    try {
      const data = await apiRequest("/volunteer/apply", {
        method: "POST",
        body: JSON.stringify(application),
      });

      if (data.token) {
        await acceptAuthToken(data.token);
      }

      setMessage(data.message);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  function getLiveLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          });
        },
        (error) =>
          reject(new Error(error.message || "Unable to get live location.")),
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
      );
    });
  }

  async function claimRescue(rescueId) {
    setMessage("Requesting live location...");

    try {
      const location = await getLiveLocation();

      const data = await apiRequest(`/volunteer/claim/${rescueId}`, {
        method: "POST",
        body: JSON.stringify(location),
      });

      setMessage(data.message);
      await loadRescues();
      setActiveView("previous");
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div>
      <Navbar />
      <section className="min-h-screen bg-[#F5F3EE] py-16 relative overflow-hidden">

        {/* Soft background accent */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white blur-3xl opacity-50 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">

          <div className="text-center max-w-2xl mx-auto">
            <p className="text-[#D89C1D] font-semibold uppercase tracking-wider text-sm">
              ANVIA Rescue Network
            </p>

            <h1 className="mt-3 text-4xl md:text-5xl font-bold text-[#355C46] leading-tight">
              Volunteer Dashboard
            </h1>

            <div className="mt-5 w-16 h-1.5 bg-[#D89C1D] rounded-full mx-auto" />
          </div>

          {isUser && (
            <form
              onSubmit={applyVolunteer}
              className="mt-12 max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8 lg:p-10 border border-[#D1CEC5]"
            >
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#355C46]/10 text-[#355C46] mb-4">
                <FaPaw size={18} />
              </span>

              <h2 className="text-3xl font-bold text-[#355C46]">
                Confirm Your Volunteer Request
              </h2>

              <p className="mt-3 text-gray-600 leading-7">
                We already have your account details. Please confirm them and
                share how you can help.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                <label className="block">
                  <span className="text-sm font-semibold text-[#355C46]">
                    Name
                  </span>
                  <input
                    value={`${user?.firstName || ""} ${user?.lastName || ""}`.trim()}
                    readOnly
                    className="mt-2 w-full border border-[#D1CEC5] p-4 rounded-2xl bg-gray-50 text-gray-600"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-[#355C46]">
                    Email
                  </span>
                  <input
                    value={user?.email || ""}
                    readOnly
                    className="mt-2 w-full border border-[#D1CEC5] p-4 rounded-2xl bg-gray-50 text-gray-600"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-[#355C46]">
                    Phone
                  </span>
                  <input
                    name="phone"
                    value={application.phone}
                    onChange={updateApplication}
                    required
                    placeholder="Your phone number"
                    className="mt-2 w-full border border-[#D1CEC5] p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D89C1D] transition"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-[#355C46]">
                    Area
                  </span>
                  <input
                    name="area"
                    value={application.area}
                    onChange={updateApplication}
                    required
                    placeholder="Area you can cover"
                    className="mt-2 w-full border border-[#D1CEC5] p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D89C1D] transition"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-sm font-semibold text-[#355C46]">
                    Availability
                  </span>
                  <input
                    name="availability"
                    value={application.availability}
                    onChange={updateApplication}
                    required
                    placeholder="Example: Weekends, evenings, urgent calls nearby"
                    className="mt-2 w-full border border-[#D1CEC5] p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D89C1D] transition"
                  />
                </label>
              </div>

              <label className="mt-6 flex gap-3 text-left text-gray-700 items-start">
                <input
                  name="pledge"
                  checked={application.pledge}
                  onChange={updateApplication}
                  type="checkbox"
                  className="mt-1 h-5 w-5 accent-[#355C46]"
                />
                <span className="text-sm leading-6">
                  I confirm I am applying from my own user account and I will be
                  helpful from my side for animal rescue support.
                </span>
              </label>

              <button
                disabled={loading}
                className="mt-8 bg-[#D89C1D] text-black px-8 py-4 rounded-2xl font-semibold hover:opacity-90 transition disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit Volunteer Request"}
              </button>
            </form>
          )}

          {message && (
            <p className="mt-8 text-center text-[#355C46] font-semibold">
              {message}
            </p>
          )}

          {isVolunteer && (
            <>
              <div className="mt-12 bg-white rounded-3xl border border-[#D1CEC5] shadow-lg p-3 grid sm:grid-cols-2 gap-3">
                <DashboardTab
                  active={activeView === "current"}
                  count={ongoing.length}
                  label="Current Rescue"
                  icon={<FaPaw size={16} />}
                  onClick={() => setActiveView("current")}
                />

                <DashboardTab
                  active={activeView === "previous"}
                  count={previous.length}
                  label="Previous Rescue"
                  icon={<FaCheckCircle size={16} />}
                  onClick={() => setActiveView("previous")}
                />
              </div>

              <div className="mt-10 bg-white rounded-3xl border border-[#D1CEC5] shadow-xl p-6 lg:p-8 min-h-420px">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 border-b border-[#E4E0D8] pb-6">
                  <div>
                    <p className="text-[#D89C1D] font-semibold uppercase tracking-wide text-sm">
                      {getViewEyebrow(activeView)}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-[#355C46]">
                      {getViewTitle(activeView)}
                    </h2>
                  </div>

                  <p className="text-sm text-gray-500 bg-[#F5F3EE] px-4 py-1.5 rounded-full">
                    {activeRescues.length} case{activeRescues.length === 1 ? "" : "s"}
                  </p>
                </div>

                {loading && (
                  <div className="min-h-72 flex flex-col items-center justify-center text-center gap-3">
                    <span className="w-10 h-10 border-3 border-[#D1CEC5] border-t-[#355C46] rounded-full animate-spin" />
                    <p className="text-[#355C46] font-semibold">
                      Loading rescue cases...
                    </p>
                  </div>
                )}

                {!loading && activeRescues.length === 0 && (
                  <EmptyState activeView={activeView} />
                )}

                {!loading && activeRescues.length > 0 && (
                  <div className="mt-8 grid md:grid-cols-2 gap-5">
                    {activeRescues.map((rescue) => (
                      <RescueCard
                        key={rescue._id}
                        rescue={rescue}
                        onView={() => setSelectedRescue(rescue)}
                        onDonate={() => navigate(`/donate/${rescue._id}`)}
                        action={
                          activeView !== "previous" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                claimRescue(rescue._id);
                              }}
                              className="bg-[#355C46] hover:bg-[#284735] transition text-white px-4 py-2 rounded-xl text-sm font-semibold"
                            >
                              Claim Rescue
                            </button>
                          )
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {selectedRescue && (
        <RescueDetailModal
          rescue={selectedRescue}
          onClose={() => setSelectedRescue(null)}
          onDonate={() => {
            navigate(`/donate/${selectedRescue._id}`);
            setSelectedRescue(null);
          }}
          action={
            activeView !== "previous" && (
              <button
                onClick={() => {
                  claimRescue(selectedRescue._id);
                  setSelectedRescue(null);
                }}
                className="bg-[#355C46] hover:bg-[#284735] transition text-white px-6 py-2.5 rounded-xl text-sm font-semibold"
              >
                Claim Rescue
              </button>
            )
          }
        />
      )}

      <Footer />
    </div>
  );
}

function DashboardTab({ active, count, label, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left transition ${
        active
          ? "bg-[#355C46] text-white"
          : "bg-[#F5F3EE] text-[#355C46] hover:bg-[#EAE6DA]"
      }`}
    >
      <span className="flex items-center gap-3">
        <span
          className={`flex items-center justify-center w-9 h-9 rounded-full shrink-0 ${
            active ? "bg-white/15 text-white" : "bg-white text-[#D89C1D]"
          }`}
        >
          {icon}
        </span>
        <span className="font-semibold text-sm">{label}</span>
      </span>

      <span
        className={`text-xs font-bold rounded-full px-2.5 py-1 ${
          active ? "bg-white/20 text-white" : "bg-white text-[#355C46]"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function EmptyState({ activeView }) {
  return (
    <div className="min-h-72 flex items-center justify-center">
      <div className="max-w-md text-center bg-[#F5F3EE] border border-[#E4E0D8] rounded-3xl px-8 py-10">
        <div className="mx-auto h-16 w-16 rounded-full bg-white border border-[#D1CEC5] flex items-center justify-center text-2xl font-bold text-[#D89C1D]">
          !
        </div>

        <h3 className="mt-5 text-2xl font-bold text-[#355C46]">
          {activeView === "current" && "No Current Rescue Cases"}
          {activeView === "emergency" && "No Emergency Cases"}
          {activeView === "previous" && "No Previous Rescue Cases"}
        </h3>

        <p className="mt-3 text-gray-600">
          {activeView === "current" &&
            "New pending rescue requests will appear here when users report them."}
          {activeView === "emergency" &&
            "High severity rescue requests will appear here when they are reported."}
          {activeView === "previous" &&
            "Your claimed and completed rescue history will appear here."}
        </p>
      </div>
    </div>
  );
}

function RescueCard({ rescue, action, onDonate, onView }) {
  const severity = getSeverity(rescue);

  return (
    <div
      onClick={onView}
      className="bg-white rounded-2xl overflow-hidden shadow-md border border-[#E4E0D8] hover:shadow-xl transition flex cursor-pointer"
    >
      <div className="relative w-36 sm:w-44 shrink-0">
        <img
          src={getUploadUrl(rescue.animalImage)}
          alt="Rescue case"
          className="h-full w-full object-cover bg-[#D1CEC5]"
        />

        <span
          className={`absolute top-2 left-2 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide shadow ${
            severityTone[severity] || severityTone.MEDIUM
          }`}
        >
          {severity}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold text-[#355C46]">Rescue Details</h3>

          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-bold border shrink-0 ${
              statusTone[rescue.status] || "bg-white text-gray-700 border-gray-200"
            }`}
          >
            {formatStatus(rescue.status)}
          </span>
        </div>

        <p className="mt-1.5 text-xs text-gray-600 whitespace-pre-line line-clamp-2">
          {rescue.description}
        </p>

        <div className="mt-2 text-xs text-gray-600 space-y-0.5">
          <p className="truncate">
            <span className="font-semibold text-[#355C46]">Address:</span>{" "}
            {rescue.address}
          </p>
          <p className="truncate">
            <span className="font-semibold text-[#355C46]">Geo-tag:</span>{" "}
            {rescue.latitude}, {rescue.longitude}
          </p>
        </div>

        <div className="mt-auto pt-3 flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
          {action}

          <button
            onClick={onDonate}
            className="bg-[#D89C1D] hover:bg-[#c58b16] transition text-black px-4 py-2 rounded-xl text-sm font-semibold"
          >
            Donate
          </button>
        </div>
      </div>
    </div>
  );
}

function RescueDetailModal({ rescue, onClose, onDonate, action }) {
  const severity = getSeverity(rescue);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl border border-[#D1CEC5] max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="relative">
          <img
            src={getUploadUrl(rescue.animalImage)}
            alt="Rescue case"
            className="h-56 w-full object-cover bg-[#D1CEC5]"
          />

          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition"
          >
            ✕
          </button>

          <div className="absolute inset-x-0 top-0 p-4 flex items-start justify-between gap-3">
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide shadow ${
                severityTone[severity] || severityTone.MEDIUM
              }`}
            >
              {severity} Severity
            </span>

            <span
              className={`rounded-full px-3 py-1.5 text-xs font-bold border shadow ${
                statusTone[rescue.status] || "bg-white text-gray-700 border-gray-200"
              }`}
            >
              {formatStatus(rescue.status)}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-2xl font-bold text-[#355C46]">Rescue Details</h3>

          <p className="mt-3 text-gray-600 leading-7 whitespace-pre-line">
            {rescue.description}
          </p>

          <div className="mt-5 space-y-3 text-sm text-gray-700 border-t border-[#E4E0D8] pt-5">
            <p>
              <span className="font-semibold text-[#355C46]">Address: </span>
              {rescue.address}
            </p>
            <p>
              <span className="font-semibold text-[#355C46]">Geo-tag: </span>
              {rescue.latitude}, {rescue.longitude}
            </p>
            {rescue.contactName && (
              <p>
                <span className="font-semibold text-[#355C46]">Reported by: </span>
                {rescue.contactName}
              </p>
            )}
            {rescue.contactPhone && (
              <p>
                <span className="font-semibold text-[#355C46]">Contact: </span>
                {rescue.contactPhone}
              </p>
            )}
            {rescue.createdAt && (
              <p>
                <span className="font-semibold text-[#355C46]">Reported on: </span>
                {new Date(rescue.createdAt).toLocaleString()}
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {action}

            <button
              onClick={onDonate}
              className="bg-[#D89C1D] hover:bg-[#c58b16] transition text-black px-6 py-2.5 rounded-xl text-sm font-semibold"
            >
              Donate
            </button>

            <button
              onClick={onClose}
              className="border border-[#D1CEC5] text-gray-600 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getSeverity(rescue) {
  const rawSeverity =
    rescue.severity ||
    rescue.severityLevel ||
    rescue.urgency ||
    rescue.level ||
    "";

  const severity = String(rawSeverity).trim().toUpperCase();

  if (["HIGH", "MEDIUM", "LOW"].includes(severity)) {
    return severity;
  }

  if (rescue.isEmergency) {
    return "HIGH";
  }

  return "MEDIUM";
}

function formatStatus(status = "") {
  return status.replaceAll("_", " ");
}

function getViewEyebrow(activeView) {
  if (activeView === "current") return "Available Cases";
  if (activeView === "emergency") return "High Priority";
  return "Rescue History";
}

function getViewTitle(activeView) {
  if (activeView === "current") return "Current Rescue Cases";
  if (activeView === "emergency") return "Emergency Rescue Cases";
  return "Previous Rescue Cases";
}

export default Volunteer;