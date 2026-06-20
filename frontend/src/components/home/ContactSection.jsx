import { useNavigate } from "react-router-dom";

function ContactSection() {
  const navigate = useNavigate();

  return (
    <section id="contact" className="py-24 bg-[#F5F3EE] scroll-mt-24 relative overflow-hidden">

      {/* Soft background accent */}
      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-white blur-3xl opacity-60 pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 lg:px-10 text-center relative">

        <p className="text-[#D89C1D] font-semibold uppercase tracking-wider text-sm">
          We're Listening
        </p>

        <h2 className="mt-3 text-4xl md:text-5xl font-bold text-[#355C46] leading-tight">
          Tell Us What's On Your Mind
        </h2>

        <div className="mt-6 w-16 h-1.5 bg-[#D89C1D] rounded-full mx-auto" />

        <p className="mt-6 text-gray-600 text-lg leading-8 max-w-xl mx-auto">
          Whether it's a question, a concern, or an animal emergency you
          want to flag — send us a quick note and our team will get back
          to you.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/feedback")}
            className="bg-[#355C46] text-white px-8 py-3.5 rounded-xl font-semibold hover:opacity-90 transition"
          >
            Share Feedback
          </button>

        </div>

      </div>

    </section>
  );
}

export default ContactSection;