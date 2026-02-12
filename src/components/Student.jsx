import axios from "axios";
import { useEffect, useState } from "react";
import { Pencil, Trash2, Power, RotateCcw } from "lucide-react";

export default function Student() {
  const token = localStorage.getItem("token");

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [view, setView] = useState("active"); // active | trash
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


  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:8000/student/findall", {
        headers: { Authorization: `Bearer ${token}` },
      }
      );
      setStudents(res.data);
    //   console.log(res.data);
    } catch (err) {
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    const res = await axios.get( "http://localhost:8000/course/allcourse")
    setCourses(res.data);
  };

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  useEffect(() => {
    let data = [...students];

    // active / trash filter
    data =
      view === "active"
        ? data.filter((s) => s.isactive)
        : data.filter((s) => !s.isactive);

    // search
    if (search) {
      data = data.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // sorting
    if (sort === "feesLow") {
      data.sort((a, b) => a.fees - b.fees);
    }
    if (sort === "feesHigh") {
      data.sort((a, b) => b.fees - a.fees);
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
      setForm({
        name: "",
        email: "",
        phone: "",
        course: "",
        fees: "",
      });
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

  console.log(students);

  const moveToTrash = async (id) => {
    await axios.delete(
      `http://localhost:8000/student/delete/${id}`,
    );
    fetchStudents();
  };

  const restoreStudent = async (id) => {
    await axios.post(
      `http://localhost:8000/student/delete/${id}`,
      { isactive: true },
      { headers: { Authorization: `Bearer ${token}` } }
    );
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
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">
        Student Management
      </h1>

      {/* ================= FILTER BUTTONS ================= */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setView("active")}
          className={`px-4 py-2 rounded ${
            view === "active"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Active Students
        </button>

        <button
          onClick={() => setView("trash")}
          className={`px-4 py-2 rounded ${
            view === "trash"
              ? "bg-red-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Trash ({trashCount})
        </button>

        <button
          onClick={() => setShowAdd(true)}
          className="ml-auto bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Student
        </button>
      </div>

      {/* SEARCH + SORT */}
      <div className="flex gap-4 mb-4">
        <input
          placeholder="Search..."
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
        </select>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-100 text-red-600 px-4 py-2 mb-4 rounded">
          {error}
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-2 py-3 text-left">Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Course</th>
              <th>Fees</th>
              <th>Status</th>
              <th>Date</th>
              <th className="pr-15">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : (
              filtered.map((student) => (
                <tr key={student._id} className="border-b">
                  <td className="px-5 py-3 text-left">{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                  <td>{student.course?.coursename}</td>
                  <td>₹{student.fees}</td>
                  <td>{student.status}</td>
                  <td>
                    {new Date(student.date).toLocaleDateString()}
                  </td>
                  <td className="space-x-2 pl-10">
                    <button
                      onClick={() => {
                        setEditStudent(student);
                        setShowEdit(true);
                      }}
                      className="text-indigo-600"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                        onClick={() =>
                          moveToTrash(student._id)
                        }
                        className="text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    {view === "active" ? (
                      <button
                        onClick={() =>
                          movetoinactive(student._id)
                        }
                        className="text-red-600"
                      >
                        <Power size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          movetoinactive(student._id)
                        }
                        className="text-green-600"
                      >
                        <RotateCcw size={18}/>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
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
    </div>
  );
}

/* ================= FORM ================= */
function StudentForm({ form, setForm, courses, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
        className="w-full border px-3 py-2 rounded"
      />

      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
        className="w-full border px-3 py-2 rounded"
      />

      <input
        placeholder="Phone"
        value={form.phone}
        onChange={(e) =>
          setForm({ ...form, phone: e.target.value })
        }
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
        type="number"
        placeholder="Fees"
        value={form.fees}
        onChange={(e) =>
          setForm({ ...form, fees: e.target.value })
        }
        className="w-full border px-3 py-2 rounded"
      />

      <button className="bg-indigo-600 text-white px-4 py-2 rounded w-full">
        Save
      </button>
    </form>
  );
}

/* ================= MODAL ================= */
function Modal({ children, title, close }) {
  return (
    <div className="fixed inset-0  bg-opacity-40 flex justify-center items-center">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
        <button
          onClick={close}
          className="mt-4 w-full bg-gray-300 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
