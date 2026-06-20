import { useNavigate } from "react-router-dom";

function EmergencyBanner() {
  const navigate = useNavigate();

  return (
    <section className="bg-red-50 py-20">

      <div className="max-w-6xl mx-auto px-10 text-center">

        <h2 className="text-4xl font-bold text-red-600">

          Animal In Immediate Danger?

        </h2>

        <p className="mt-4 text-gray-700 text-lg">

          Report injured, abandoned or emergency animal rescue cases instantly.

        </p>

        <button onClick={() => navigate("/create-rescue?type=emergency")} className="mt-8 bg-red-600 text-white px-8 py-4 rounded-xl font-semibold hover:scale-105">

          Report Emergency Rescue

        </button>

      </div>

    </section>
  );
}

export default EmergencyBanner;
