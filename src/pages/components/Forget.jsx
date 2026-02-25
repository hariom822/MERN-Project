import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgetPassword() {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [coPassword, setCoPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  // ✅ STEP 1 → EMAIL → /otp
  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMsg("");

    try {
      const res = await fetch("http://localhost:8000/users/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OTP not sent");

      setMsg("OTP sent successfully to your email ✅");
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ STEP 2 → ALL FIELDS → /forget
  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMsg("");

    if (newPassword !== coPassword) {
      setLoading(false);
      return setError("Password and confirm password must match");
    }

    try {
      const res = await fetch("http://localhost:8000/users/forget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          newpassword: newPassword,
          copassword: coPassword
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reset failed");

      setMsg("Password reset successful 🎉");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Forgot Password
        </h2>

        {/* STEP 1 */}
        {step === 1 && (
          <form onSubmit={sendOtp}>
            <input
              type="email"
              placeholder="Enter registered email"
              className="w-full mb-4 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={resetPassword}>
            <input
              type="email"
              value={email}
              disabled
              className="w-full mb-3 px-4 py-3 border rounded-lg bg-gray-100"
            />

            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full mb-3 px-4 py-3 border rounded-lg"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="New Password"
              className="w-full mb-3 px-4 py-3 border rounded-lg"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full mb-4 px-4 py-3 border rounded-lg"
              value={coPassword}
              onChange={(e) => setCoPassword(e.target.value)}
              required
            />

            <button
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>
        )}

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        {msg && <p className="text-green-600 text-sm mt-4">{msg}</p>}
      </div>
    </div>
  );
}
