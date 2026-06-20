import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useAuth } from "../context/AuthContext";

function Feedback() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "",
    email: user?.email || "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.message) {
      setError("Please fill in your name, email, and message.");
      return;
    }

    setSubmitting(true);

    try {
      const subject = encodeURIComponent(form.subject || "ANVIA Feedback");
      const body = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
      );

      window.location.href = `mailto:support@anvia.org?subject=${subject}&body=${body}`;

      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Navbar />

      <section className="py-24 min-h-screen bg-[#F5F3EE]">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-[#D89C1D] font-semibold uppercase tracking-wide">
              We'd love to hear from you
            </p>
            <h1 className="mt-3 text-4xl font-bold text-[#355C46]">
              Share Your Feedback
            </h1>
            <p className="mt-4 text-gray-600">
              Questions, suggestions, or concerns about ANVIA. For animal
              emergencies, please use Report Rescue instead so we can respond
              faster.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#D1CEC5]">
            {submitted ? (
              <div className="text-center py-6">
                <h2 className="text-2xl font-bold text-[#355C46]">Thank you!</h2>
                <p className="mt-3 text-gray-600">
                  Your mail app should have opened with your feedback ready to send.
                  If it didn't open, you can email us directly at support@anvia.org
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 bg-[#355C46] text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  type="text"
                  placeholder="Your Name"
                  className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D89C1D]"
                />

                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  type="email"
                  placeholder="Your Email"
                  className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D89C1D]"
                />

                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  type="text"
                  placeholder="Subject (optional)"
                  className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D89C1D]"
                />

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  placeholder="Your Message"
                  rows="6"
                  className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D89C1D]"
                />

                {error && <p className="text-red-600 font-medium">{error}</p>}

                <button
                  disabled={submitting}
                  className="w-full bg-[#355C46] text-white py-4 rounded-xl font-semibold disabled:opacity-70"
                >
                  {submitting ? "Sending..." : "Send Feedback"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Feedback;