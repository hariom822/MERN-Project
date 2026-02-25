import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddCourse() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    coursename: "",
    duration: "",
    fees: "",
    level: "beginner",
    description: "",
  });

  // 🔹 input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/course/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Course not added");

      alert("Course added successfully ");
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Add New Course
      </h2>

      {error && (
        <p className="text-red-500 mb-4 text-sm">{error}</p>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          name="coursename"
          placeholder="Course Name"
          value={form.coursename}
          onChange={handleChange}
          className="border px-4 py-2 rounded-lg"
          required
        />

        <input
          name="duration"
          placeholder="Duration (e.g. 6 Months)"
          value={form.duration}
          onChange={handleChange}
          className="border px-4 py-2 rounded-lg"
          required
        />

        <input
          name="fees"
          type="number"
          placeholder="Fees"
          value={form.fees}
          onChange={handleChange}
          className="border px-4 py-2 rounded-lg"
          required
        />

        <select
          name="level"
          value={form.level}
          onChange={handleChange}
          className="border px-4 py-2 rounded-lg"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        {/* <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border px-4 py-2 rounded-lg"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select> */}

        <textarea
          name="description"
          placeholder="Course Description"
          value={form.description}
          onChange={handleChange}
          className="border px-4 py-2 rounded-lg md:col-span-2"
          rows="4"
        ></textarea>

        <div className="md:col-span-2 flex gap-4 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            {loading ? "Saving..." : "Add Course"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="bg-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
