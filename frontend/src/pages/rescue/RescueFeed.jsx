import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import RescueCard from "../../components/rescue/RescueCard";
import { apiRequest } from "../../services/api";

function RescueFeed() {
  const [rescues, setRescues] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRescues() {
      try {
        const data = await apiRequest("/rescue");
        setRescues(data.payload || []);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadRescues();
  }, []);

  return (
    <div>
      <Navbar />

      <section className="py-24 bg-[#F5F3EE] min-h-screen">
        <div className="max-w-7xl mx-auto px-10">
          <h1 className="text-4xl font-bold text-[#355C46] text-center">Active Rescue Cases</h1>

          {loading && <p className="text-center mt-10 text-gray-600">Loading rescue cases...</p>}
          {message && <p className="text-center mt-10 text-red-600 font-medium">{message}</p>}

          <div className="grid md:grid-cols-3 gap-8 mt-14">
            {rescues.map((rescue) => (
              <RescueCard key={rescue._id} {...rescue} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default RescueFeed;
