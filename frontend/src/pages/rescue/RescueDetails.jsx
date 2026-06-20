import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import RescueStatusTracker from "../../components/rescue/RescueStatusTracker";
import { apiRequest, getUploadUrl } from "../../services/api";

function RescueDetails() {
  const { id } = useParams();
  const [rescue, setRescue] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRescue() {
      try {
        const data = await apiRequest(`/rescue/${id}`);
        setRescue(data.payload);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadRescue();
  }, [id]);

  return (
    <div>
      <Navbar />

      <section className="py-24 bg-white min-h-screen">
        <div className="max-w-5xl mx-auto px-10">
          {loading && <p className="text-center text-gray-600">Loading rescue details...</p>}
          {message && <p className="text-center text-red-600 font-medium">{message}</p>}

          {rescue && (
            <>
              <img src={getUploadUrl(rescue.animalImage)} alt="Rescue case" className="w-full h-96 object-cover rounded-2xl shadow-lg" />

              <div className="mt-8 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-bold text-[#355C46]">Rescue Case</h1>
                  <p className="mt-5 text-gray-600 whitespace-pre-line leading-8">{rescue.description}</p>
                </div>

                <Link to={`/donate/${rescue._id}`}>
                  <button className="bg-[#D89C1D] text-black px-8 py-3 rounded-xl font-semibold">Donate To Case</button>
                </Link>
              </div>

              <div className="mt-8 bg-[#F5F3EE] rounded-2xl p-6 space-y-2">
                <p>Location: {rescue.address}</p>
                <p>Geo-tag: {rescue.latitude}, {rescue.longitude}</p>
                <p>Status: {rescue.status}</p>
                <p>Total Donations: Rs. {rescue.totalDonations || 0}</p>
              </div>

              <RescueStatusTracker currentStatus={rescue.status} />
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default RescueDetails;
