import axios from "axios";
import { useEffect, useState } from "react";
import { Pencil, Trash2, Power, RotateCcw } from "lucide-react";

export default function Student() {
  const token = localStorage.getItem("token");
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [showAssign, setShowAssign] = useState(false);
  const [assignStudent, setAssignStudent] = useState(null);
  const [assignBatch, setAssignBatch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("active");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    fees: "",
  });
  const [editStudent, setEditStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
    fetchCourses();
    fetchBatches();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:8000/student/findall", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
    } catch (err) {
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const fetchBatches = async () => {
    try {
      const res = await axios.get("http://localhost:8000/batch/allbatch");
      setBatches(res.data);
    } catch (err) {
      console.error("Failed to load batches", err);
    }
  };

  const handleBatchChange = async (studentId, batchId) => {
    try {
      await axios.post(`http://localhost:8000/student/batch/${studentId}`, {
        batchId,
      });
      fetchStudents();
    } catch (error) {
      console.error("Batch update failed", error);
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!assignStudent) return;
    try {
      await axios.post(
        `http://localhost:8000/student/batchchange/${assignStudent._id}`,
        { batchId: assignBatch },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowAssign(false);
      setAssignStudent(null);
      setAssignBatch("");
      fetchStudents();
    } catch (err) {
      console.error("Assign batch failed", err);
    }
  };

  const fetchCourses = async () => {
    const res = await axios.get("http://localhost:8000/course/allcourse");
    setCourses(res.data);
  };

  // ✅ FIXED: search + fees + date sorting
  useEffect(() => {
    let data = [...students];

    // active / trash filter
    data =
      view === "active"
        ? data.filter((s) => s.isactive)
        : data.filter((s) => !s.isactive);

    // ✅ search fix
    if (search) {
      data = data.filter((s) =>
        s.visitorId?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // ✅ sorting
    if (sort === "feesLow") {
      data.sort((a, b) => Number(a.fees) - Number(b.fees));
    } else if (sort === "feesHigh") {
      data.sort((a, b) => Number(b.fees) - Number(a.fees));
    } else if (sort === "dateNew") {
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sort === "dateOld") {
      data.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    setFiltered(data);
  }, [students, view, search, sort]);

  const trashCount = students.filter((s) => !s.isactive).length;

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/student/", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowAdd(false);
      setForm({ name: "", email: "", phone: "", course: "", fees: "" });
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || "Add failed");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8000/student/update/${editStudent._id}`,
        editStudent,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowEdit(false);
      fetchStudents();
    } catch (err) {
      setError("Update failed");
    }
  };

  const moveToTrash = async (id) => {
    await axios.delete(`http://localhost:8000/student/delete/${id}`);
    fetchStudents();
  };

  const movetoinactive = async (id) => {
    await axios.post(
      `http://localhost:8000/student/active/${id}`,
      { isactive: false },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchStudents();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Management</h1>

      {/* FILTER BUTTONS */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setView("active")}
          className={`px-4 py-2 rounded ${
            view === "active" ? "bg-indigo-600 text-white" : "bg-gray-200"
          }`}
        >
          Active Students
        </button>
        <button
          onClick={() => setView("trash")}
          className={`px-4 py-2 rounded ${
            view === "trash" ? "bg-red-600 text-white" : "bg-gray-200"
          }`}
        >
          Trash ({trashCount})
        </button>
        {/* <button
          onClick={() => setShowAdd(true)}
          className="ml-auto px-4 py-2 bg-green-600 text-white rounded"
        >
          + Add Student
        </button> */}
      </div>

      {/* SEARCH + SORT */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-1/3"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Sort By</option>
          <option value="feesLow">Fees Low → High</option>
          <option value="feesHigh">Fees High → Low</option>
          <option value="dateNew">Date New → Old</option>
          <option value="dateOld">Date Old → New</option>
        </select>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-100 text-red-600 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              {/* <th className="p-2 border">Course</th> */}
              <th className="p-2 border">Source</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-4 text-gray-500">
                  No students found
                </td>
              </tr>
            ) : (
              filtered.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="p-2 border">{student.visitorId?.name}</td>
                  <td className="p-2 border">{student.visitorId?.email}</td>
                  <td className="p-2 border">{student.visitorId?.phone}</td>
                  {/* <td className="p-2 border">{student.course?.coursename}</td> */}
                  <td className="p-2 border">{student.visitorId?.source}</td>
                  <td className="p-2 border">{student.visitorId?.status}</td>
                  <td className="p-2 border">
                    {student.date
                      ? new Date(student.date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-2 border">
                    <div className="flex gap-2 items-center flex-wrap">
                      {/* <button
                        onClick={() => {
                          setEditStudent(student);
                          setShowEdit(true);
                        }}
                        className="text-indigo-600"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => moveToTrash(student._id)}
                        className="text-red-600"
                      >
                        <Trash2 size={16} />
                      </button> */}
                      <button
                        onClick={() => {
                          setAssignStudent(student);
                          setAssignBatch(
                            student.batch?._id || student.batch || ""
                          );
                          setShowAssign(true);
                        }}
                        className="border px-3 py-1 rounded text-sm bg-gray-100 hover:bg-gray-200"
                      >
                        {student.batch ? "Change Batch" : "Assign"}
                      </button>
                      {view === "active" ? (
                        <button
                          onClick={() => movetoinactive(student._id)}
                          className="text-red-600"
                        >
                          <Power size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => movetoinactive(student._id)}
                          className="text-green-600"
                        >
                          <RotateCcw size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ADD MODAL */}
      {showAdd && (
        <Modal title="Add Student" close={() => setShowAdd(false)}>
          <StudentForm
            form={form}
            setForm={setForm}
            courses={courses}
            onSubmit={handleAdd}
          />
        </Modal>
      )}

      {/* EDIT MODAL */}
      {showEdit && editStudent && (
        <Modal title="Edit Student" close={() => setShowEdit(false)}>
          <StudentForm
            form={editStudent}
            setForm={setEditStudent}
            courses={courses}
            onSubmit={handleUpdate}
          />
        </Modal>
      )}

      {/* ASSIGN BATCH MODAL */}
      {showAssign && assignStudent && (
        <Modal title="Assign Batch" close={() => setShowAssign(false)}>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Student:{" "}
              <span className="font-semibold">
                {assignStudent.visitorId?.name}
              </span>
            </p>
            <div>
              <label className="block text-sm mb-1">Select Batch</label>
              <select
                value={assignBatch}
                onChange={(e) => {
                  const bid = e.target.value;
                  setAssignBatch(bid);
                  handleBatchChange(assignStudent._id, bid);
                }}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Batch</option>
                {batches.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.batchName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAssign(false)}
                className="w-1/2 bg-gray-300 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignSubmit}
                className="w-1/2 bg-indigo-600 text-white py-2 rounded"
              >
                Assign
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ================= FORM ================= */
function StudentForm({ form, setForm, courses, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Name"
        value={form.name || ""}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email || ""}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="text"
        placeholder="Phone"
        value={form.phone || ""}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className="w-full border px-3 py-2 rounded"
      />
      <select
        value={form.course || ""}
        onChange={(e) => setForm({ ...form, course: e.target.value })}
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
        type="number"
        placeholder="Fees"
        value={form.fees || ""}
        onChange={(e) => setForm({ ...form, fees: e.target.value })}
        className="w-full border px-3 py-2 rounded"
      />
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded"
      >
        Save
      </button>
    </form>
  );
}

function Modal({ children, title, close }) {
  return (
    <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={close} className="text-gray-500 hover:text-black text-xl">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}