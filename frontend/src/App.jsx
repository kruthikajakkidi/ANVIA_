import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";

/* HOME */
import Home from "./pages/Home";
import Feedback from "./pages/Feedback";

/* RESCUE MODULE */
import RescueFeed from "./pages/rescue/RescueFeed";
import CreateRescue from "./pages/rescue/CreateRescue";
import RescueDetails from "./pages/rescue/RescueDetails";

/* VOLUNTEER MODULE */
import Volunteer from "./pages/volunteer/Volunteer";

/* DONATION MODULE */
import Donate from "./pages/donation/Donate";           // existing rescue donation
import DonatePage from "./pages/donation/DonatePage";   // NEW general donation page

/* AUTH */
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import GoogleSuccess from "./pages/auth/GoogleSuccess";

/* ADMIN */
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ================= HOME ================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/feedback"
          element={<Feedback />}
        />

        <Route
          path="/auth/google/success"
          element={<GoogleSuccess />}
        />

        {/* ================= RESCUE MODULE ================= */}

        <Route
          path="/rescues"
          element={<RescueFeed />}
        />

        <Route
          path="/create-rescue"
          element={
            <ProtectedRoute roles={["USER", "VOLUNTEER"]}>
              <CreateRescue />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rescues/:id"
          element={<RescueDetails />}
        />

        {/* ================= VOLUNTEER MODULE ================= */}

        <Route
          path="/volunteer"
          element={
            <ProtectedRoute roles={["USER", "VOLUNTEER"]}>
              <Volunteer />
            </ProtectedRoute>
          }
        />

        {/* ================= DONATION MODULE ================= */}

        {/* NEW NAVBAR DONATION PAGE */}
        <Route
          path="/donate"
          element={
            <ProtectedRoute roles={["USER", "VOLUNTEER"]}>
              <DonatePage />
            </ProtectedRoute>
          }
        />

        {/* EXISTING RESCUE-SPECIFIC DONATION */}
        <Route
          path="/donate/:id"
          element={
            <ProtectedRoute roles={["USER", "VOLUNTEER"]}>
              <Donate />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ================= */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;