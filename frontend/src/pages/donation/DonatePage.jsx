import { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { apiRequest } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function DonatePage() {
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");

  const [details, setDetails] = useState({
    name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    panNumber: "",
  });

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const donationAmount = Number(amount) || 0;
  const quickAmounts = [500, 1000, 2500, 5000];

  function updateDetails(e) {
    setDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function validateDetails() {
    return Object.values(details).every(Boolean);
  }

  async function openPayment() {
    setSubmitting(true);
    setMessage("");

    try {
      const orderData = await apiRequest("/donation/create-order", {
        method: "POST",
        body: JSON.stringify({
          amount: donationAmount,
          donorDetails: details,
        }),
      });

      const ready = await loadRazorpay();
      const key = import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!ready || !key) {
        setMessage("Razorpay failed to load.");
        return;
      }

      const order = orderData.payload.order;

      const razorpay = new window.Razorpay({
        key,
        amount: order.amount,
        currency: order.currency,
        name: "ANVIA",
        description: "General donation",
        order_id: order.id,

        prefill: {
          name: details.name,
          email: details.email,
          contact: details.phone,
        },

        theme: {
          color: "#355C46",
        },

        handler: async (response) => {
          await apiRequest("/donation/verify-payment", {
            method: "POST",
            body: JSON.stringify(response),
          });

          setMessage("Donation successful. Thank you for supporting ANVIA.");
        },
      });

      razorpay.open();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Navbar />

      <section
        className="min-h-screen py-20 bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/images/donate-bg.jpg')",
        }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-black/35"></div>

        {/* donation card */}
<div className="relative ml-auto mr-30 z-10 max-w-lg min-h-600px bg-[#d8fde8] backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-white/30">
          <h1 className="text-4xl font-bold text-[#355C46] text-center tracking-tight">
            Support ANVIA
          </h1>
          <p className="text-center mt-3 text-gray-500 leading-7">
            Help rescue, protect and provide urgent medical aid to animals in need.
          </p>

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                placeholder="Enter donation amount"
                className="w-full mt-10 border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D89C1D]"
              />

              <div className="mt-6 grid grid-cols-4 gap-3">
                {quickAmounts.map((value) => (
                  <button
                    key={value}
                    onClick={() => setAmount(String(value))}
                    className="border border-gray-300 rounded-xl py-3 hover:bg-[#355C46] hover:text-white transition"
                  >
                    ₹{value}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full mt-8 bg-[#355C46] text-white py-4 rounded-xl hover:scale-[1.01] transition"
              >
                Next
              </button>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div className="grid gap-4 mt-8">
                {[
                  "email",
                  "phone",
                  "name",
                  "address",
                  "city",
                  "state",
                  "panNumber",
                ].map((field) => (
                  <input
                    key={field}
                    name={field}
                    value={details[field]}
                    onChange={updateDetails}
                    placeholder={field}
                    className="border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D89C1D]"
                  />
                ))}
              </div>

              <button
                onClick={() => validateDetails() && setStep(3)}
                className="w-full mt-8 bg-[#355C46] text-white py-4 rounded-xl hover:scale-[1.01] transition"
              >
                Proceed
              </button>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <div className="mt-10 bg-[#F5F3EE] p-6 rounded-2xl">
                <p className="text-sm text-gray-500">Donation Amount</p>

                <p className="text-3xl font-bold text-[#355C46] mt-2">
                  ₹{donationAmount}
                </p>
              </div>

              <button
                disabled={submitting}
                onClick={openPayment}
                className="w-full mt-8 bg-[#D89C1D] py-4 rounded-xl font-bold hover:scale-[1.01] transition disabled:opacity-70"
              >
                {submitting ? "Opening..." : "Pay Now"}
              </button>
            </>
          )}

          {/* message */}
          {message && (
            <p className="mt-6 text-center text-[#355C46] font-medium">
              {message}
            </p>
          )}

          {/* razorpay image */}
          <div className="mt-10 flex flex-col items-center">
            <p className="text-xs text-gray-500 mb-2 font-medium">
              Secure Payments Powered By
            </p>

            <img
              src="/images/razorpay.png"
              alt="Razorpay"
              className="h-15 w-30 object-contain"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default DonatePage;