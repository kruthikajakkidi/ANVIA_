import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaPaw, FaGoogle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../services/api";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState(location.state?.message || "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");
    setError("");
    setSubmitting(true);

    try {
      const user = await login(form);

      navigate(
        location.state?.from?.pathname ||
          (user.role === "ADMIN" ? "/admin/dashboard" : "/"),
        { replace: true }
      );
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  }

  function googleLogin() {
    const redirectTo = location.state?.from?.pathname || "/";
    sessionStorage.setItem("anviaRedirectAfterLogin", redirectTo);
    window.location.href = `${API_BASE_URL}/auth/google`;
  }

  return (
    <section className="min-h-screen bg-[#F5F3EE] grid lg:grid-cols-2">
      {/* Left Side */}
      <div className="bg-[#355C46] text-white p-10 lg:p-16 flex flex-col justify-between">
        <Link to="/" className="flex items-center gap-3 text-2xl font-bold">
          <FaPaw className="text-[#D89C1D]" />
          ANVIA
        </Link>

        <div className="max-w-lg">
          <p className="text-[#D89C1D] font-semibold uppercase tracking-wide">
            Welcome back
          </p>

          <h1 className="mt-5 text-5xl font-bold leading-tight">
            Continue animal rescue work with your network.
          </h1>

          <p className="mt-6 text-gray-200 leading-8">
            Login to report rescues, apply as a volunteer, claim field cases,
            or support donations.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center justify-center px-6 py-16">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 lg:p-10 space-y-5"
        >
          <div>
            <h2 className="text-4xl font-bold text-[#355C46]">Login</h2>
            <p className="mt-2 text-gray-600">
              Use your registered ANVIA account.
            </p>
          </div>

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Email"
            className="w-full border p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D89C1D]"
          />

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Password"
            className="w-full border p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D89C1D]"
          />

          {/* Success Message */}
          {message && (
            <p className="text-[#355C46] font-medium">{message}</p>
          )}

          {/* Error Message */}
          {error && (
            <p className="text-red-600 font-medium">{error}</p>
          )}

          <button
            disabled={submitting}
            className="w-full bg-[#D89C1D] text-black py-4 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-70"
          >
            {submitting ? "Logging In..." : "Login"}
          </button>

         <button
  type="button"
  onClick={googleLogin}
  className="w-full border border-[#355C46] text-[#355C46] py-4 rounded-xl font-semibold hover:bg-[#355C46] hover:text-white transition flex items-center justify-center gap-3"
>
  <img
    src="/images/google-logo.png"
    alt="Google"
    className="w-7 h-7 object-contain"
  />

  Continue with Google
</button>

          <p className="text-center text-gray-600">
            New to ANVIA?{" "}
            <Link to="/signup" className="text-[#355C46] font-semibold">
              Create account
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Login;