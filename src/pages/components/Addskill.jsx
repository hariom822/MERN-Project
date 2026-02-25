import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddSkill() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    duration: "",
    price: "",
    mode: "online",
  });

  // 🔹 input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8000/skill",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Skill added successfully");
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to add skill"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8">
        
        <h2 className="text-2xl font-bold mb-6 text-indigo-600 text-center">
          Add New Skill
        </h2>

        {error && (
          <p className="bg-red-100 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <input
            type="text"
            name="name"
            placeholder="Skill Name (e.g. MERN Stack)"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          <input
            type="text"
            name="duration"
            placeholder="Duration (e.g. 6 Months)"
            value={form.duration}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price (₹)"
            value={form.price}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          <select
            name="mode"
            value={form.mode}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              {loading ? "Saving..." : "Add Skill"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
