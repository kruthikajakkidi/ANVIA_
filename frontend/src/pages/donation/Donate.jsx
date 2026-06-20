import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { apiRequest, getUploadUrl } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { FaPaw, FaShieldAlt } from "react-icons/fa";

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

const STEP_LABELS = ["Amount", "Donor Details", "Payment"];

function Donate() {
  const { id } = useParams();
  const { user } = useAuth();
  const [rescue, setRescue] = useState(null);
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

  useEffect(() => {
    async function loadRescue() {
      try {
        const data = await apiRequest(`/rescue/${id}`);
        setRescue(data.payload);
      } catch (err) {
        setMessage(err.message);
      }
    }

    loadRescue();
  }, [id]);

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
    setMessage("");
    setSubmitting(true);

    try {
      const orderData = await apiRequest("/donation/create-order", {
        method: "POST",
        body: JSON.stringify({
          rescueCase: id,
          amount: donationAmount,
          donorDetails: details,
        }),
      });

      const ready = await loadRazorpay();
      const key = import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!ready || !key) {
        setMessage("Donation order created. Add VITE_RAZORPAY_KEY_ID to enable Razorpay checkout.");
        return;
      }

      const order = orderData.payload.order;

      const razorpay = new window.Razorpay({
        key,
        amount: order.amount,
        currency: order.currency,
        name: "ANVIA",
        description: "Animal rescue donation",
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

          setMessage("Donation successful. Thank you for supporting this rescue.");
        },
        modal: {
          ondismiss: () => setMessage("Payment window closed before completion."),
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

      <section className="py-16 min-h-screen bg-[#F5F3EE] relative overflow-hidden">

        {/* Soft background accent */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl opacity-50 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 lg:px-10 relative">

          <div className="text-center max-w-xl mx-auto mb-10">
            <p className="text-[#D89C1D] font-semibold uppercase tracking-wider text-sm">
              Secure Donation
            </p>
            <h1 className="mt-3 text-4xl font-bold text-[#355C46] leading-tight">
              Donate to This Rescue Case
            </h1>
            <div className="mt-5 w-16 h-1.5 bg-[#D89C1D] rounded-full mx-auto" />
          </div>

          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">

            <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg border border-[#D1CEC5]">
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#355C46]/10 text-[#355C46] mb-4">
                <FaPaw size={16} />
              </span>

              {rescue ? (
                <>
                  <div className="relative">
                    <img
                      src={getUploadUrl(rescue.animalImage)}
                      alt="Rescue case"
                      className="h-64 w-full object-cover rounded-2xl"
                    />
                  </div>

                  <p className="mt-5 text-gray-600 leading-7 whitespace-pre-line line-clamp-5">
                    {rescue.description}
                  </p>

                  <p className="mt-4 text-sm text-gray-500 border-t border-[#E4E0D8] pt-4">
                    <span className="font-semibold text-[#355C46]">Geo-tag:</span>{" "}
                    {rescue.latitude}, {rescue.longitude}
                  </p>
                </>
              ) : (
                <div className="h-64 w-full rounded-2xl bg-[#F5F3EE] animate-pulse" />
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-2xl border border-[#D1CEC5] overflow-hidden max-w-500px ml-auto">
              <div className="bg-[#355C46] text-white">
                <div className="px-5 py-4 flex items-center justify-between border-b border-white/10">
                  <span className="font-semibold text-sm uppercase tracking-wide text-[#D89C1D]">
                    Step {step} of 3 &middot; {STEP_LABELS[step - 1]}
                  </span>

                  <div className="flex items-center gap-2">
                    {[1, 2, 3].map((s) => (
                      <span
                        key={s}
                        className={`h-2 rounded-full transition-all ${
                          step >= s ? "w-8 bg-[#D89C1D]" : "w-2 bg-white/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="px-5 py-6 flex items-center gap-4">
                  {step > 1 && (
                    <button
                      onClick={() => setStep(step - 1)}
                      className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-xl"
                      aria-label="Go back"
                    >
                      &larr;
                    </button>
                  )}

                  <h2 className="text-2xl lg:text-3xl font-bold truncate">
                    ANVIA Donation
                  </h2>
                </div>
              </div>

              {step === 1 && (
                <div className="min-h-390px px-5 py-8 pb-28">
                  <label className="block text-lg font-semibold text-[#355C46]">
                    Amount <span className="text-red-600">*</span>
                  </label>

                  <div className="mt-4 flex items-center border border-gray-300 rounded-xl px-4 focus-within:ring-2 focus-within:ring-[#D89C1D] transition">
                    <span className="font-bold text-[#355C46]">Rs.</span>

                    <input
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      min="500"
                      type="number"
                      placeholder="0"
                      className="w-full p-4 focus:outline-none text-lg"
                    />
                  </div>

                  <p className="mt-3 text-sm text-gray-500">
                    Donate any amount of your choice (minimum Rs. 500)
                  </p>

                  <div className="mt-6 grid grid-cols-4 gap-2">
                    {quickAmounts.map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setAmount(String(value))}
                        className={`py-2.5 rounded-xl text-sm font-semibold border transition ${
                          Number(amount) === value
                            ? "bg-[#355C46] text-white border-[#355C46]"
                            : "border-[#D1CEC5] text-[#355C46] hover:border-[#D89C1D]"
                        }`}
                      >
                        Rs. {value}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="max-h-520px overflow-y-auto px-5 py-7 pb-28">
                  <div className="grid gap-4">
                    {[
                      ["email", "Email"],
                      ["phone", "Phone"],
                      ["name", "Name"],
                      ["address", "Address"],
                      ["city", "City"],
                      ["state", "State"],
                      ["panNumber", "PAN Number"],
                    ].map(([name, label]) =>
                      name === "address" ? (
                        <textarea
                          key={name}
                          name={name}
                          value={details[name]}
                          onChange={updateDetails}
                          required
                          placeholder={`${label} *`}
                          className="border border-[#D1CEC5] p-4 rounded-xl min-h-16 focus:outline-none focus:ring-2 focus:ring-[#D89C1D] transition"
                        />
                      ) : (
                        <input
                          key={name}
                          name={name}
                          value={details[name]}
                          onChange={updateDetails}
                          required
                          placeholder={`${label} *`}
                          className="border border-[#D1CEC5] p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D89C1D] transition"
                        />
                      )
                    )}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="min-h-390px px-5 py-8 pb-28">
                  <div className="bg-[#F5F3EE] rounded-2xl p-6 border border-[#E4E0D8]">
                    <p className="text-xs uppercase tracking-wide text-[#D89C1D] font-semibold">
                      Donation Summary
                    </p>

                    <p className="mt-3 text-2xl font-bold text-[#355C46]">
                      Rs. {donationAmount.toFixed(2)}
                    </p>

                    <div className="mt-4 space-y-1.5 text-sm text-gray-600 border-t border-[#E4E0D8] pt-4">
                      <p>
                        <span className="font-semibold text-[#355C46]">Donor:</span>{" "}
                        {details.name}
                      </p>
                      <p>
                        <span className="font-semibold text-[#355C46]">Email:</span>{" "}
                        {details.email}
                      </p>
                    </div>
                  </div>

                  {message && (
                    <p className="mt-5 text-[#355C46] font-medium">
                      {message}
                    </p>
                  )}
                </div>
              )}

              <div className="sticky bottom-0 bg-white border-t border-gray-100 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] px-5 py-4 flex items-center gap-5">
                <div className="text-2xl font-bold text-[#355C46] min-w-28">
                  Rs. {donationAmount.toFixed(2)}
                </div>

                {step === 1 && (
                  <button
                    onClick={() =>
                      donationAmount >= 500
                        ? setStep(2)
                        : setMessage("Minimum donation amount is Rs. 500.")
                    }
                    className="flex-1 bg-[#355C46] text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition"
                  >
                    Next
                  </button>
                )}

                {step === 2 && (
                  <button
                    onClick={() =>
                      validateDetails()
                        ? setStep(3)
                        : setMessage("Please fill all donor details.")
                    }
                    className="flex-1 bg-[#355C46] text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition"
                  >
                    Proceed to Pay
                  </button>
                )}

                {step === 3 && (
                  <button
                    disabled={submitting}
                    onClick={openPayment}
                    className="flex-1 bg-[#D89C1D] text-black py-4 rounded-xl font-bold text-lg hover:opacity-90 transition disabled:opacity-70"
                  >
                    {submitting ? "Opening..." : "Pay Now"}
                  </button>
                )}
              </div>

              <div className="bg-[#F5F3EE] px-5 py-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                <FaShieldAlt size={13} className="text-[#355C46]" />
                Secured by <span className="font-bold text-black">Razorpay</span>
              </div>

              {message && step !== 3 && (
                <p className="px-5 pb-5 text-[#355C46] font-medium">
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Donate;