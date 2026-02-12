import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Power, RotateCcw } from "lucide-react";

export default function Visitors() {

  const token = localStorage.getItem("token");

  const [visitors, setVisitors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredVisitors, setFilteredVisitors] = useState([]);

  const [search, setSearch] = useState("");
  const [showTrash, setShowTrash] = useState(false);
  const [sortField, setSortField] = useState("name");

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);

  const [selectedVisitor, setSelectedVisitor] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    coures: "",
    status: "new",
    source: "website"
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    filterData();
  }, [visitors, search, showTrash, sortField]);

  // 🔹 Fetch Data
  const fetchAll = async () => {
    try {
      const visRes = await axios.get(
        "http://localhost:8000/visitor/allvisitor",
        // { headers: { Authorization: `Bearer ${token}` } }
      );
      setVisitors(visRes.data);

      const courseRes = await axios.get(
        "http://localhost:8000/course/allcourse",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourses(courseRes.data);

    } catch (err) {
      setError("Failed to load visitors");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Filter + Sort
  const filterData = () => {
    let data = [...visitors];

    data = data.filter(v =>
      showTrash ? !v.isActive : v.isActive
    );

    if (search) {
      data = data.filter(v =>
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    data.sort((a, b) =>
      a[sortField]?.toString().localeCompare(
        b[sortField]?.toString()
      )
    );

    setFilteredVisitors(data);
  };

  // 🔹 Add Visitor
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8000/visitor/",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowAddPopup(false);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add visitor");
    }
  };

  // 🔹 Edit Visitor
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:8000/visitor/updatevisitor/${selectedVisitor._id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowEditPopup(false);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update visitor");
    }
  };

  // 🔹 Toggle Active / Trash
  const toggleStatus = async (id, current) => {
    try {
      await axios.post(
        `http://localhost:8000/visitor/activevisitor/${id}`,
        { isActive: !current },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAll();
    } catch (err) {
      setError("Failed to update status");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">
        Visitors Management
      </h1>

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      {/* ACTIVE / TRASH */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setShowTrash(false)}
          className={`px-4 py-2 rounded-lg ${
            !showTrash ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
        >
          Active
        </button>

        <button
          onClick={() => setShowTrash(true)}
          className={`px-4 py-2 rounded-lg ${
            showTrash ? "bg-red-600 text-white" : "bg-gray-200"
          }`}
        >
          Trash
        </button>
      </div>

      {/* SEARCH + ADD */}
      <div className="flex justify-between mb-6">
        <input
          placeholder="Search visitor..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-64"
        />

        <button
          onClick={()=>setShowAddPopup(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Visitor
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
              <th>Course</th>
              <th>Status</th>
              <th>Source</th>
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
            ) : filteredVisitors.map(visitor => (
              <tr key={visitor._id} className="border-b">
                <td className="px-4 py-3">{visitor.name}</td>
                <td>{visitor.email}</td>
                <td>{visitor.phone}</td>
                <td>{visitor.coures?.coursename || "N/A"}</td>
                <td>{visitor.status}</td>
                <td>{visitor.source}</td>
                <td>
                  <button
                    onClick={()=>{
                      setSelectedVisitor(visitor);
                      setForm(visitor);
                      setShowEditPopup(true);
                    }}
                    className="text-indigo-600 mr-3"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={()=>toggleStatus(visitor._id, visitor.isActive)}
                    className="text-red-600"
                  >
                    {visitor.isActive ?  <Power size={18} /> : <RotateCcw size={18} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* POPUPS */}
      {showAddPopup && (
        <VisitorPopup
          title="Add Visitor"
          form={form}
          setForm={setForm}
          courses={courses}
          onSubmit={handleAdd}
          onClose={()=>setShowAddPopup(false)}
        />
      )}

      {showEditPopup && (
        <VisitorPopup
          title="Edit Visitor"
          form={form}
          setForm={setForm}
          courses={courses}
          onSubmit={handleEdit}
          onClose={()=>setShowEditPopup(false)}
        />
      )}
    </div>
  );
}

/* 🔹 Popup Component */
function VisitorPopup({ title, form, setForm, courses, onSubmit, onClose }) {
  return (
    <div className="fixed inset-0  bg-opacity-40 flex justify-center items-center z-50">
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

          <select
            value={form.coures}
            onChange={(e)=>setForm({...form,coures:e.target.value})}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Course</option>
            {courses.map(c=>(
              <option key={c._id} value={c._id}>
                {c.coursename}
              </option>
            ))}
          </select>

          <select
            value={form.status}
            onChange={(e)=>setForm({...form,status:e.target.value})}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="interested">Interested</option>
            <option value="not interested">Not Interested</option>
          </select>

          <select
            value={form.source}
            onChange={(e)=>setForm({...form,source:e.target.value})}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="website">Website</option>
            <option value="social media">Social Media</option>
            <option value="referral">Referral</option>
            <option value="other">Other</option>
          </select>

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
