import { FaInstagram, FaPaw, FaFacebook, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#254144] text-white relative overflow-hidden">

      {/* Soft background accent */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#355C46] blur-3xl opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 relative">

        <div className="grid md:grid-cols-4 gap-10">
{/* BRAND */}
<div className="md:col-span-1">
  <Link to="/" className="flex items-center gap-3">
    <img
      src="/images/logo.png"
      alt="ANVIA logo"
      className="w-14 h-14 rounded-full object-cover"
    />
    <span className="text-4xl font-bold text-[#D89C1D] leading-tight">
      ANVIA
    </span>
  </Link>

  <p className="mt-3 text-m text-gray-300 leading-6">
    Animal Network for Volunteer Intervention &amp; Aid — community
    action for injured and abandoned animals.
  </p>
</div>
{/* NAVIGATE */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-[#D89C1D]">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3 text-gray-300 text-sm">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/rescues" className="hover:text-white transition">Success Stories</Link></li>
              <li><Link to="/volunteer" className="hover:text-white transition">Volunteer</Link></li>
              <li><Link to="/feedback" className="hover:text-white transition">Feedback</Link></li>
            </ul>
          </div>

          {/* SERVICES */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-[#D89C1D]">
              Services
            </h3>

            <ul className="mt-5 space-y-3 text-gray-300 text-sm">
              <li><Link to="/create-rescue" className="hover:text-white transition">Report Rescue</Link></li>
              <li><Link to="/#donate" className="hover:text-white transition">Donate</Link></li>
              <li><Link to="/volunteer" className="hover:text-white transition">Become a Volunteer</Link></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-[#D89C1D]">
              Contact
            </h3>

            <ul className="mt-5 space-y-3 text-gray-300 text-sm">
              <li>Hyderabad, India</li>
              <li>
                <a href="mailto:support@anvia.org" className="hover:text-white transition">
                  support@anvia.org
                </a>
              </li>
            </ul>

            <div className="flex gap-3 mt-5">
              <a
                href="#"
                aria-label="ANVIA on Instagram"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-[#D89C1D] hover:text-[#1F464A] transition"
              >
                <FaInstagram size={16} />
              </a>
              <a
                href="#"
                aria-label="ANVIA on Facebook"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-[#D89C1D] hover:text-[#1F464A] transition"
              >
                <FaFacebook size={16} />
              </a>
              <a
                href="#"
                aria-label="ANVIA on Twitter"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-[#D89C1D] hover:text-[#1F464A] transition"
              >
                <FaTwitter size={16} />
              </a>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} ANVIA — Animal Network for Volunteer Intervention &amp; Aid.</p>
          <p>Built for community-driven animal rescue.</p>
        </div>

      </div>

    </footer>
  );
}

export default Footer;