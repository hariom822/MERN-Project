import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Power, RotateCcw } from "lucide-react";
export default function Employee() {

  const token = localStorage.getItem("token");

  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [sortField, setSortField] = useState("name");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    salary: "",
    menttype: "",
    pannumbert: "",
    status: "active"
  });

  const [addherimage, setAddherImage] = useState(null);
  const [profileimage, setProfileImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterData();
  }, [employees, search, showInactive, sortField]);

  // 🔹 Fetch
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/employe/allemployee",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmployees(res.data);
    } catch (err) {
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Filter + Sort
  const filterData = () => {
    let data = [...employees];

    data = data.filter(emp =>
      showInactive
        ? emp.status === "inactive"
        : emp.status === "active"
    );

    if (search) {
      data = data.filter(emp =>
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    data.sort((a, b) =>
      a[sortField]?.toString().localeCompare(
        b[sortField]?.toString()
      )
    );

    setFilteredEmployees(data);
  };

  // 🔹 Add Employee
  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });

      formData.append("addherimage", addherimage);
      formData.append("profileimage", profileimage);

      await axios.post(
        "http://localhost:8000/employe/",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowAddPopup(false);
      fetchEmployees();

    } catch (err) {
      setError(err.response?.data?.message || "Failed to add employee");
    }
  };

  // 🔹 Edit Employee
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8000/employe/updateemployee/${selectedEmployee._id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowEditPopup(false);
      fetchEmployees();
    } catch {
      setError("Failed to update employee");
    }
  };

  // 🔹 Toggle Active / Inactive
  const toggleStatus = async (id, currentStatus) => {
    try {
   await axios.post(
  `http://localhost:8000/employe/ststusemployee/${id}`,
  {},   
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

      fetchEmployees();
    } catch (err) {
      setError("Failed to update status");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">
        Employee Management
      </h1>

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      {/* Active / Inactive */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setShowInactive(false)}
          className={`px-4 py-2 rounded-lg ${
            !showInactive ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
        >
          Active
        </button>

        <button
          onClick={() => setShowInactive(true)}
          className={`px-4 py-2 rounded-lg ${
            showInactive ? "bg-red-600 text-white" : "bg-gray-200"
          }`}
        >
          Inactive
        </button>
      </div>

      {/* Search + Add */}
      <div className="flex justify-between mb-6">
        <input
          placeholder="Search employee..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-64"
        />

       <button
  onClick={() => {
    setForm({
      name: "",
      email: "",
      phone: "",
      salary: "",
      menttype: "",
      pannumbert: "",
      status: "active"
    });
    setAddherImage(null);
    setProfileImage(null);
    setShowAddPopup(true);
  }}
  className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
>
  + Add Employee
</button>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-4 py-3">Profile</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Salary</th>
              <th>Type</th>
              <th>PAN</th>
              <th>Aadhar</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : filteredEmployees.map(emp => (
              <tr key={emp._id} className="border-b">
                <td className="px-4 py-3">
                  <img
                    src={emp.profileimage}
                    className="w-12 h-12 rounded-full object-cover"
                    alt=""
                  />
                </td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.phone}</td>
                <td>₹{emp.salary}</td>
                <td>{emp.menttype}</td>
                <td>{emp.pannumbert}</td>
                <td>
                  <img
                    src={emp.addherimage}
                    className="w-12 h-12 object-cover"
                    alt=""
                  />
                </td>
                <td>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    emp.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {emp.status}
                  </span>
                </td>
                <td>
                  <button
                    onClick={()=>{
                      setSelectedEmployee(emp);
                      setForm(emp);
                      setShowEditPopup(true);
                    }}
                    className="text-indigo-600 mr-3"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={()=>toggleStatus(emp._id, emp.status)}
                    className="text-red-600"
                  >
                    {emp.status === "active" ? <Power size={18} /> :<RotateCcw size={18} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* ADD / EDIT POPUP */}
{(showAddPopup || showEditPopup) && (
  <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">

      <h2 className="text-xl font-bold mb-4">
        {showAddPopup ? "Add Employee" : "Edit Employee"}
      </h2>

      {error && (
        <p className="text-red-500 mb-3 text-sm">{error}</p>
      )}

      <form
        onSubmit={showAddPopup ? handleAdd : handleEdit}
        className="space-y-3"
      >

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
        />

        <input
          placeholder="Salary"
          value={form.salary}
          onChange={(e)=>setForm({...form,salary:e.target.value})}
          className="w-full border px-3 py-2 rounded"
        />

        <input
          placeholder="Employment Type"
          value={form.menttype}
          onChange={(e)=>setForm({...form,menttype:e.target.value})}
          className="w-full border px-3 py-2 rounded"
        />

        <input
          placeholder="PAN Number"
          value={form.pannumbert}
          onChange={(e)=>setForm({...form,pannumbert:e.target.value})}
          className="w-full border px-3 py-2 rounded"
        />

        {showAddPopup && (
          <>
            <div>
              <label className="text-sm text-gray-600">Aadhar Image</label>
              <input
                type="file"
                onChange={(e)=>setAddherImage(e.target.files[0])}
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Profile Image</label>
              <input
                type="file"
                onChange={(e)=>setProfileImage(e.target.files[0])}
                className="w-full"
                required
              />
            </div>
          </>
        )}

        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={()=>{
              setShowAddPopup(false);
              setShowEditPopup(false);
            }}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            {showAddPopup ? "Add" : "Update"}
          </button>
        </div>

      </form>
    </div>
  </div>
)}

    </div>
  );
}
