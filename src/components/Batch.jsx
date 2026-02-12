import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Power, RotateCcw } from "lucide-react";

export default function Batch() {

  const token = localStorage.getItem("token");

  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [tutors, setTutors] = useState([]);

  const [filteredBatches, setFilteredBatches] = useState([]);

  const [search, setSearch] = useState("");
  const [showTrash, setShowTrash] = useState(false);
  const [sortField, setSortField] = useState("batchName");

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);

  const [selectedBatch, setSelectedBatch] = useState(null);

  const [form, setForm] = useState({
    batchName: "",
    course: "",
    tutor: "",
    startDate: "",
    endDate: "",
    student: 0,
    status: "upcoming"
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    filterData();
  }, [batches, search, showTrash, sortField]);

  // 🔹 Fetch all data
  const fetchAll = async () => {
    try {
      const batchRes = await axios.get(
        "http://localhost:8000/batch/allbatch",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBatches(batchRes.data);

      const courseRes = await axios.get(
        "http://localhost:8000/course/allcourse",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourses(courseRes.data);

      const tutorRes = await axios.get(
        "http://localhost:8000/tutor/findall",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTutors(tutorRes.data);

    } catch (err) {
      setError("Failed to load batch data");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Filter + Sort
  const filterData = () => {
    let data = [...batches];

    data = data.filter(b =>
      showTrash ? !b.isActive : b.isActive
    );

    if (search) {
      data = data.filter(b =>
        b.batchName.toLowerCase().includes(search.toLowerCase())
      );
    }

    data.sort((a, b) =>
      a[sortField]?.toString().localeCompare(
        b[sortField]?.toString()
      )
    );

    setFilteredBatches(data);
  };

  // 🔹 Add Batch
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8000/batch/",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowAddPopup(false);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add batch");
    }
  };

  // 🔹 Edit Batch
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8000/batch/updatebatch/${selectedBatch._id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowEditPopup(false);
      fetchAll();
    } catch {
      setError("Failed to update batch");
    }
  };

  // 🔹 Toggle Active
  const toggleStatus = async (id, current) => {
    try {
      await axios.put(
        `http://localhost:8000/batch/activebatch/${id}`,
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
        Batch Management
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
          placeholder="Search batch..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-64"
        />

        <button
          onClick={()=>setShowAddPopup(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Batch
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Batch</th>
              <th>Course</th>
              <th>Tutor</th>
              <th>Students</th>
              <th>Status</th>
              <th>Start</th>
              <th>End</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : filteredBatches.map(batch => (
              <tr key={batch._id} className="border-b">
                <td className="px-4 py-3 font-medium">
                  {batch.batchName}
                </td>
                <td>{batch.course?.coursename}</td>
                <td>{batch.tutor?.name}</td>
                <td>{batch.student}</td>
                <td>
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                    {batch.status}
                  </span>
                </td>
                <td>{new Date(batch.startDate).toLocaleDateString()}</td>
                <td>{new Date(batch.endDate).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={()=>{
                      setSelectedBatch(batch);
                      setForm(batch);
                      setShowEditPopup(true);
                    }}
                    className="text-indigo-600 mr-3"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={()=>toggleStatus(batch._id, batch.isActive)}
                    className="text-red-600"
                  >
                    {batch.isActive ? <Power size={18} /> : <RotateCcw size={18} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* POPUPS */}
      {showAddPopup && (
        <BatchPopup
          title="Add Batch"
          form={form}
          setForm={setForm}
          courses={courses}
          tutors={tutors}
          onSubmit={handleAdd}
          onClose={()=>setShowAddPopup(false)}
        />
      )}

      {showEditPopup && (
        <BatchPopup
          title="Edit Batch"
          form={form}
          setForm={setForm}
          courses={courses}
          tutors={tutors}
          onSubmit={handleEdit}
          onClose={()=>setShowEditPopup(false)}
        />
      )}

    </div>
  );
}

function BatchPopup({ title, form, setForm, courses, tutors, onSubmit, onClose }) {
  return (
    <div className="fixed inset-0  bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        <form onSubmit={onSubmit} className="space-y-4">

          <input
            placeholder="Batch Name"
            value={form.batchName}
            onChange={(e)=>setForm({...form,batchName:e.target.value})}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <select
            value={form.course}
            onChange={(e)=>setForm({...form,course:e.target.value})}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select Course</option>
            {courses.map(c=>(
              <option key={c._id} value={c._id}>
                {c.coursename}
              </option>
            ))}
          </select>

          <select
            value={form.tutor}
            onChange={(e)=>setForm({...form,tutor:e.target.value})}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select Tutor</option>
            {tutors.map(t=>(
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={form.startDate}
            onChange={(e)=>setForm({...form,startDate:e.target.value})}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="date"
            value={form.endDate}
            onChange={(e)=>setForm({...form,endDate:e.target.value})}
            className="w-full border px-3 py-2 rounded"
            required
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
