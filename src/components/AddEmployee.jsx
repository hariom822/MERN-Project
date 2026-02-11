import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddEmployee() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    salary: "",
    menttype: "",
    pannumbert: ""
  });

  const [addherimage, setAddherImage] = useState(null);
  const [profileimage, setProfileImage] = useState(null);

  // 🔹 INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 SUBMIT FORM (FORM-DATA)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("salary", form.salary);
      formData.append("menttype", form.menttype);
      formData.append("pannumbert", form.pannumbert);
      formData.append("addherimage", addherimage);
      formData.append("profileimage", profileimage);
      
     const token = JSON.parse(localStorage.getItem("token"));

const res = await fetch("http://localhost:8000/employe/", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`, // ✅ yahin lagta hai
  },
  body: formData, // ✅ FormData direct
});

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Employee add failed");

      alert("Employee added successfully ");
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 mt-5 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Add New Employee
      </h2>

      {error && (
        <p className="text-red-500 mb-4 text-sm">{error}</p>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="border px-4 py-2 rounded-lg"
          required
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
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
          required
        />

        <input
          name="salary"
          placeholder="Salary"
          value={form.salary}
          onChange={handleChange}
          className="border px-4 py-2 rounded-lg"
          required
        />

        <select
          name="menttype"
          value={form.menttype}
          onChange={handleChange}
          className="border px-4 py-2 rounded-lg"
          required
        >
          <option value="">Select Employment Type</option>
          <option value="fulltime">Full Time</option>
          <option value="parttime">Part Time</option>
        </select>

        <input
          name="pannumbert"
          placeholder="PAN Number"
          value={form.pannumbert}
          onChange={handleChange}
          className="border px-4 py-2 rounded-lg"
          required
        />
        {/* ADDHAR IMAGE */}
        <div>
          <label className="text-sm text-gray-600">Aadhar Image</label>
          <input
            type="file"
            onChange={(e) => setAddherImage(e.target.files[0])}
            className="w-full mt-1"
            required
          />
        </div>

        {/* PROFILE IMAGE */}
        <div>
          <label className="text-sm text-gray-600">Profile Image</label>
          <input
            type="file"
            onChange={(e) => setProfileImage(e.target.files[0])}
            className="w-full mt-1"
            required
          />
        </div>

        <div className="md:col-span-2 flex gap-4 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            {loading ? "Saving..." : "Add Employee"}
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
