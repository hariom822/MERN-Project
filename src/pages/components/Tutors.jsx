import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Power, RotateCcw } from "lucide-react";

export default function Tutors() {

  const token = localStorage.getItem("token");

  const [tutors, setTutors] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);
   const [courses, setCourses] = useState([]) || [];
  const [search, setSearch] = useState("");
  const [showTrash, setShowTrash] = useState(false);
  const [sortField, setSortField] = useState("name");

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);

  const [selectedTutor, setSelectedTutor] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    salary: "",
    experience: ""
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTutors();
     fetchCourses();
  }, []);

  useEffect(() => {
    filterData();
   
  }, [tutors, search, showTrash, sortField]);

  // 🔹 Fetch Tutors
  const fetchTutors = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/tutor/findall",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTutors(res.data);
    } catch (err) {
      setError("Failed to load tutors");
    } finally {
      setLoading(false);
    }
  };
   const fetchCourses = async () => {
    const res = await axios.get( "http://localhost:8000/course/allcourse")
    setCourses(res.data);
  };
  // 🔹 Filter + Sort
  const filterData = () => {
    let data = [...tutors];

    data = data.filter(t =>
      showTrash ? !t.isactive : t.isactive
    );

    if (search) {
      data = data.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    data.sort((a, b) =>
      a[sortField]?.toString().localeCompare(
        b[sortField]?.toString()
      )
    );

    setFilteredTutors(data);
  };

  // 🔹 Add Tutor
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8000/tutor/",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowAddPopup(false);
      setForm({
        name: "",
        email: "",
        phone: "",
        salary: "",
        experience: ""
      });
      fetchTutors();
    } catch {
      setError("Failed to add tutor");
    }
  };

  // 🔹 Edit Tutor
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:8000/tutor/update/${selectedTutor._id}`,
        form,
        // { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowEditPopup(false);
      fetchTutors();
    } catch (err) {
      setError("Failed to update tutor");
    }
  };

  // 🔹 Toggle Active / Trash
  const toggleStatus = async (id, current) => {
    try {
      await axios.post(
        `http://localhost:8000/tutor/active/${id}`,
        { isactive: !current },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTutors();
    } catch (err) {
      setError("Failed to update status");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">
        Tutors Management
      </h1>

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      {/* ACTIVE / TRASH BUTTONS */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setShowTrash(false)}
          className={`px-4 py-2 rounded-lg ${
            !showTrash
              ? "bg-green-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Active
        </button>

        <button
          onClick={() => setShowTrash(true)}
          className={`px-4 py-2 rounded-lg ${
            showTrash
              ? "bg-red-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Trash
        </button>
      </div>

      {/* SEARCH + ADD */}
      <div className="flex justify-between mb-6">
        <input
          type="text"
          placeholder="Search tutor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-64"
        />

        <button
          onClick={() => setShowAddPopup(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Tutor
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Salary</th>
              <th>Experience</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : filteredTutors.map(tutor => (
              <tr key={tutor._id} className="border-b">

                <td className="px-4 py-3">{tutor.name}</td>
                <td>{tutor.email}</td>
                <td>{tutor.phone}</td>
                <td>₹ {tutor.salary}</td>
                <td>{tutor.experience}</td>

                <td>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    tutor.isactive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {tutor.isactive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td>
                  <button
                    onClick={() => {
                      setSelectedTutor(tutor);
                      setForm(tutor);
                      setShowEditPopup(true);
                    }}
                    className="text-indigo-600 mr-3"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() =>
                      toggleStatus(tutor._id, tutor.isactive)
                    }
                    className="text-red-600"
                  >
                    {tutor.isactive ? <Power size={18} /> : <RotateCcw size={18}/>}
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD POPUP */}
      {showAddPopup && (
        <Popup
          title="Add Tutor"
          form={form}
          setForm={setForm}
          courses={courses}
          onSubmit={handleAdd}
          onClose={() => setShowAddPopup(false)}
        />
      )}

      {/* EDIT POPUP */}
      {showEditPopup && (
        <Popup
          title="Edit Tutor"
          form={form}
          courses={courses}
          setForm={setForm}
          onSubmit={handleEdit}
          onClose={() => setShowEditPopup(false)}
        />
      )}
    </div>
  );
}

/* 🔹 Popup Component */
function Popup({ title, form, setForm,courses, onSubmit, onClose }) {
  return (
    <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center z-50">

      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e)=>setForm({...form,name:e.target.value})}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e)=>setForm({...form,email:e.target.value})}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e)=>setForm({...form,phone:e.target.value})}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Salary"
            value={form.salary}
            onChange={(e)=>setForm({...form,salary:e.target.value})}
            className="w-full border px-3 py-2 rounded"
          />
           <select
        value={form.course}
        onChange={(e) =>
          setForm({ ...form, course: e.target.value })
        }
        className="w-full border px-3 py-2 rounded"
      >
        <option value="">Select Course</option>
        {courses.map((c) => (
          <option key={c._id} value={c._id}>
            {c.coursename}
          </option>
        ))}
      </select>
          <input
            placeholder="Experience"
            value={form.experience}
            onChange={(e)=>setForm({...form,experience:e.target.value})}
            className="w-full border px-3 py-2 rounded"
          />

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
            <button type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
