import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiRequest } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function RescueForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    userName: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "",
    contactNumber: "",
    animalType: "",
    description: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const isEmergency = useMemo(() => searchParams.get("type") === "emergency", [searchParams]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleImage(e) {
    const file = e.target.files?.[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  function detectLocation() {
    setMessage("");

    if (!navigator.geolocation) {
      setMessage("Geolocation is not supported by this browser.");
      return;
    }

    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude.toFixed(6);
        const longitude = position.coords.longitude.toFixed(6);

        setForm((prev) => ({
          ...prev,
          latitude,
          longitude,
          address: prev.address || `Geo-tag: ${latitude}, ${longitude}`,
        }));
        setDetecting(false);
      },
      (error) => {
        setMessage(error.message || "Unable to detect current location.");
        setDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!image) {
      setMessage("Animal image is required.");
      return;
    }

    if (!form.latitude || !form.longitude) {
      setMessage("Please detect or enter geo-tag coordinates before submitting.");
      return;
    }

    const data = new FormData();
    data.append("animalImage", image);
    data.append("contactNumber", form.contactNumber);
    data.append("address", form.address);
    data.append("latitude", form.latitude);
    data.append("longitude", form.longitude);
    data.append(
      "description",
      `Animal Type: ${form.animalType}\nReporter: ${form.userName}\n${isEmergency ? "Priority: Emergency\n" : ""}${form.description}`
    );

    setSubmitting(true);

    try {
      const response = await apiRequest("/rescue", {
        method: "POST",
        body: data,
      });

      navigate(`/rescues/${response.payload._id}`);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isEmergency && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 font-medium">
          Emergency rescue report
        </div>
      )}

      <input name="userName" value={form.userName} onChange={handleChange} required type="text" placeholder="User Name" className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D89C1D]" />

      <input name="contactNumber" value={form.contactNumber} onChange={handleChange} required type="tel" placeholder="Phone Number" className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D89C1D]" />

      <input name="animalType" value={form.animalType} onChange={handleChange} required type="text" placeholder="Animal Type" className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D89C1D]" />

      <textarea name="description" value={form.description} onChange={handleChange} required placeholder="Description" rows="4" className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D89C1D]" />

      <div className="grid md:grid-cols-2 gap-4">
        <input name="latitude" value={form.latitude} onChange={handleChange} required type="number" step="any" placeholder="Latitude" className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D89C1D]" />
        <input name="longitude" value={form.longitude} onChange={handleChange} required type="number" step="any" placeholder="Longitude" className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D89C1D]" />
      </div>

      <textarea name="address" value={form.address} onChange={handleChange} required placeholder="Location / Address" rows="3" className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D89C1D] focus:border-[#D89C1D]" />

      <button type="button" onClick={detectLocation} className="bg-[#D89C1D] text-black px-6 py-3 rounded-xl font-semibold">
        {detecting ? "Detecting Location..." : "Detect Current Location"}
      </button>

      <label className="block border-2 border-dashed border-[#D89C1D] bg-[#F5F3EE] rounded-xl p-6 text-center cursor-pointer hover:bg-white">
        <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleImage} className="sr-only" />
        <span className="font-semibold text-[#355C46]">{image ? image.name : "Upload animal image"}</span>
        <span className="block mt-2 text-sm text-gray-500">PNG, JPG, JPEG or WEBP</span>
      </label>

      {preview && <img src={preview} alt="preview" className="w-60 rounded-xl shadow-lg" />}

      {message && <p className="text-red-600 font-medium">{message}</p>}

      <button disabled={submitting} className="bg-[#355C46] text-white px-8 py-3 rounded-xl">
        {submitting ? "Submitting..." : "Submit Rescue Report"}
      </button>
    </form>
  );
}

export default RescueForm;
