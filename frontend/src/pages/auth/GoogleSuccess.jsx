import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function GoogleSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { acceptAuthToken } = useAuth();
  const [message, setMessage] = useState("Completing Google login...");

  useEffect(() => {
    async function completeLogin() {
      const token = searchParams.get("token");

      if (!token) {
        setMessage("Google login failed. Please try again.");
        return;
      }

      try {
        const user = await acceptAuthToken(token);
        const redirectTo =
          sessionStorage.getItem("anviaRedirectAfterLogin") ||
          (user.role === "ADMIN" ? "/admin/dashboard" : "/");

        sessionStorage.removeItem("anviaRedirectAfterLogin");
        navigate(redirectTo, { replace: true });
      } catch (err) {
        setMessage(err.message || "Google login failed. Please try again.");
      }
    }

    completeLogin();
  }, [acceptAuthToken, navigate, searchParams]);

  return (
    <section className="min-h-screen bg-[#F5F3EE] flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md">
        <h1 className="text-3xl font-bold text-[#355C46]">ANVIA</h1>
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </section>
  );
}

export default GoogleSuccess;
