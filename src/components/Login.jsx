import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const res = await axios.post("http://localhost:8000/users/login", {
      email,
      password,
    });

    const data = res.data; 
   localStorage.setItem("userId", data.id);
    localStorage.setItem("token", data.token); 
    alert("Login successful ✅");
    navigate("/");
  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white w-full max-w-md rounded-xl shadow-xl p-8"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login 
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <button
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Forget Password */}
        <p
          onClick={() => navigate("/forget")}
          className="text-center text-sm text-indigo-600 mt-4 cursor-pointer hover:underline"
        >
          Forgot password?
        </p>
      </form>
    </div>
  );
}
