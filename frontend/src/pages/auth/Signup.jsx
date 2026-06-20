import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPaw, FaUser, FaHandHoldingHeart } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function selectRole(role) {
    setForm((prev) => ({ ...prev, role }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);

    try {
      const user = await register(form);
      navigate(user.role === "ADMIN" ? "/admin/dashboard" : "/", { replace: true });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="min-h-screen bg-[#F5F3EE] grid lg:grid-cols-2">
      <div className="bg-[#355C46] text-white p-10 lg:p-16 flex flex-col justify-between">
        <Link to="/" className="flex items-center gap-3 text-2xl font-bold">
          <FaPaw className="text-[#D89C1D]" />
          ANVIA
        </Link>

        <div className="max-w-lg">
          <p className="text-[#D89C1D] font-semibold uppercase tracking-wide">Join the network</p>
          <h1 className="mt-5 text-5xl font-bold leading-tight">Create an account for rescue action.</h1>
          <p className="mt-6 text-gray-200 leading-8">
            Register as a user to report rescues, donate, and apply for volunteer review.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <form onSubmit={handleSubmit} className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 lg:p-10 space-y-5">
          <div>
            <h2 className="text-4xl font-bold text-[#355C46]">Signup</h2>
            <p className="mt-2 text-gray-600">Create your account and confirm your details.</p>
          </div>

          {/* ROLE SELECTOR */}
          <div>
            <p className="text-sm font-semibold text-[#355C46] mb-2">I want to join as a</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => selectRole("USER")}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition ${
                  form.role === "USER"
                    ? "border-[#355C46] bg-[#355C46]/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span
                  className={`flex items-center justify-center w-9 h-9 rounded-full shrink-0 ${
                    form.role === "USER" ? "bg-[#355C46] text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <FaUser size={14} />
                </span>
                <span>
                  <span className="block font-semibold text-[#355C46]">User</span>
                  <span className="block text-xs text-gray-500 mt-0.5">
                    Report rescues and donate
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => selectRole("VOLUNTEER")}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition ${
                  form.role === "VOLUNTEER"
                    ? "border-[#355C46] bg-[#355C46]/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span
                  className={`flex items-center justify-center w-9 h-9 rounded-full shrink-0 ${
                    form.role === "VOLUNTEER" ? "bg-[#355C46] text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <FaHandHoldingHeart size={14} />
                </span>
                <span>
                  <span className="block font-semibold text-[#355C46]">Volunteer</span>
                  <span className="block text-xs text-gray-500 mt-0.5">
                    Claim and respond to rescues
                  </span>
                </span>
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <input name="firstName" value={form.firstName} onChange={handleChange} required placeholder="First Name" className="border p-4 rounded-xl" />
            <input name="lastName" value={form.lastName} onChange={handleChange} required placeholder="Last Name" className="border p-4 rounded-xl" />
          </div>

          <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Email" className="w-full border p-4 rounded-xl" />
          <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Password" className="w-full border p-4 rounded-xl" />

          {message && <p className="text-red-600 font-medium">{message}</p>}

          <button disabled={submitting} className="w-full bg-[#D89C1D] text-black py-4 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60">
            {submitting ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center text-gray-600">
            Already registered? <Link to="/login" className="text-[#355C46] font-semibold">Login</Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Signup;