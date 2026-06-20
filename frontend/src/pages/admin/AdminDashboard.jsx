import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { apiRequest, getUploadUrl } from "../../services/api";

const statusTone = {
  PENDING: "bg-yellow-50 text-yellow-700",
  CLAIMED: "bg-blue-50 text-blue-700",
  IN_PROGRESS: "bg-orange-50 text-orange-700",
  COMPLETED: "bg-green-50 text-green-700",
};

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [currentRescues, setCurrentRescues] = useState([]);
  const [previousRescues, setPreviousRescues] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [
          dashboardData,
          userData,
          volunteerData,
          donationData,
          currentData,
          previousData,
        ] = await Promise.all([
          apiRequest("/admin/dashboard"),
          apiRequest("/admin/users"),
          apiRequest("/admin/volunteers"),
          apiRequest("/admin/donations"),
          apiRequest("/admin/current-rescues"),
          apiRequest("/admin/previous-rescues"),
        ]);

        setDashboard(dashboardData.payload);
        setUsers(userData.payload || []);
        setVolunteers(volunteerData.payload || []);
        setDonations(donationData.payload || []);
        setCurrentRescues(currentData.payload || []);
        setPreviousRescues(previousData.payload || []);
      } catch (err) {
        setMessage(err.message);
      }
    }

    loadAdminData();
  }, []);

  const stats = [
    ["Total Volunteers", dashboard?.totalVolunteers || 0],
    ["Total Donors", dashboard?.totalDonors || 0],
    ["Total Rescue Cases", dashboard?.totalRescues || 0],
    ["Emergency Cases", dashboard?.emergencyCases || 0],
  ];

  return (
    <div>
      <Navbar />

      <section className="min-h-screen bg-[#F5F3EE] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[#D89C1D] font-semibold uppercase tracking-wide">Admin</p>
              <h1 className="mt-2 text-4xl font-bold text-[#355C46]">Dashboard</h1>
            </div>
            <p className="text-gray-600">Volunteer locations, donations, rescues, and user activity.</p>
          </div>

          {message && <p className="mt-8 text-red-600 font-semibold">{message}</p>}

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            {stats.map(([label, value]) => (
              <div key={label} className="bg-white rounded-2xl shadow-lg border border-[#D1CEC5] p-6">
                <p className="text-gray-500">{label}</p>
                <h2 className="mt-3 text-4xl font-bold text-[#355C46]">{value}</h2>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mt-10">
            <Panel title="Volunteers">
              {volunteers.map((volunteer) => (
                <PersonRow key={volunteer._id} person={volunteer} />
              ))}
            </Panel>

            <Panel title="Donors">
              {donations.map((donation) => (
                <div key={donation._id} className="border-b border-[#D1CEC5] py-4 last:border-0">
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#355C46]">{donation.donorDetails?.name}</p>
                      <p className="text-sm text-gray-500">{donation.donorDetails?.email}</p>
                    </div>
                    <p className="font-bold text-[#D89C1D]">Rs. {donation.amount}</p>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{donation.donorDetails?.city}, {donation.donorDetails?.state}</p>
                </div>
              ))}
            </Panel>
          </div>

          <Panel title="Current Rescue Details" wide>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {currentRescues.map((rescue) => (
                <RescueAdminCard key={rescue._id} rescue={rescue} />
              ))}
            </div>
          </Panel>

          <Panel title="Previous Rescue History" wide>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {previousRescues.map((rescue) => (
                <RescueAdminCard key={rescue._id} rescue={rescue} />
              ))}
            </div>
          </Panel>

          <Panel title="Users" wide>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {users.map((user) => (
                <PersonRow key={user._id} person={user} />
              ))}
            </div>
          </Panel>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Panel({ title, children, wide }) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-[#D1CEC5] p-6 mt-8 ${wide ? "lg:col-span-2" : ""}`}>
      <h2 className="text-2xl font-bold text-[#355C46]">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function PersonRow({ person }) {
  const location = person.liveLocation;

  return (
    <div className="border border-[#D1CEC5] rounded-xl p-4">
      <div className="flex justify-between gap-3">
        <div>
          <p className="font-semibold text-[#355C46]">{person.firstName} {person.lastName}</p>
          <p className="text-sm text-gray-500 break-all">{person.email}</p>
        </div>
        <span className="text-xs font-semibold text-[#D89C1D]">{person.role}</span>
      </div>
      {location?.latitude && (
        <p className="mt-3 text-sm text-gray-600">
          Live: {location.latitude}, {location.longitude}
        </p>
      )}
    </div>
  );
}

function RescueAdminCard({ rescue }) {
  return (
    <div className="border border-[#D1CEC5] rounded-xl overflow-hidden">
      <img src={getUploadUrl(rescue.animalImage)} alt="Rescue case" className="h-40 w-full object-cover" />
      <div className="p-4">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusTone[rescue.status] || "bg-gray-100 text-gray-700"}`}>
          {rescue.status}
        </span>
        <p className="mt-3 text-gray-600 line-clamp-3 whitespace-pre-line">{rescue.description}</p>
        <p className="mt-3 text-sm text-gray-500">{rescue.address}</p>
        <p className="mt-2 text-sm text-gray-500">Case: {rescue.latitude}, {rescue.longitude}</p>
        {rescue.volunteerLocation?.latitude && (
          <p className="mt-2 text-sm text-[#355C46]">
            Volunteer: {rescue.volunteerLocation.latitude}, {rescue.volunteerLocation.longitude}
          </p>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
