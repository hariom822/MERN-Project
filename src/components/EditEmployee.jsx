import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    salary: "",
    menttype: "",
    pannumbert: "",
    status: ""
  });

  // 🔹 GET SINGLE EMPLOYEE
  const getEmployee = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/employe/oneemployee/${id}`
      );
      const data = await res.json();

      setForm({
        name: data.name || "",
        phone: data.phone || "",
        salary: data.salary || "",
        menttype: data.menttype || "",
        pannumbert: data.pannumbert || "",
        status: data.status || ""
      });
    } catch (err) {
      setError("Failed to load employee");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmployee();
  }, [id]);

  // 🔹 INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  // 🔹 UPDATE EMPLOYEE
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        "http://localhost:8000/employe/updateemployee",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: id, ...form })
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      alert("Employee updated successfully ✅");
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading employee...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-20 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Edit Employee
      </h2>

      {error && (
        <p className="text-red-500 mb-4 text-sm">{error}</p>
      )}

      <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="border px-4 py-2 rounded-lg"
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="border px-4 py-2 rounded-lg"
        />

        <input
          name="salary"
          placeholder="Salary"
          value={form.salary}
          onChange={handleChange}
          className="border px-4 py-2 rounded-lg"
        />

        <select
          name="menttype"
          value={form.menttype}
          onChange={handleChange}
          className="border px-4 py-2 rounded-lg"
        >
          <option value="">Select Type</option>
          <option value="fulltime">Full Time</option>
          <option value="parttime">Part Time</option>
        </select>

        <input
          name="pannumbert"
          placeholder="PAN Number"
          value={form.pannumbert}
          onChange={handleChange}
          className="border px-4 py-2 rounded-lg"
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border px-4 py-2 rounded-lg"
        >
          <option value="pending">Pending</option>
          <option value="active">Active</option>
        </select>

        <div className="md:col-span-2 flex gap-4 mt-4">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Update Employee
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
