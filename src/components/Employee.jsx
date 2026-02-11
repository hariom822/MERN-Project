import axios from "axios";
import { useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
export default function Employee() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showaddemployee, setShowAddEmployee] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    salary: "",
    menttype: "",
    pannumbert: "",
    status: ""
  });
const navigate=useNavigate()
  const getAllEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:8000/employe/allemployee");
      setEmployees(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllEmployees();
  }, []);

  // 🔹 OPEN EDIT POPUP
  const openEditPopup = (emp) => {
    setEditId(emp._id);
    setForm({
      name: emp.name || "",
      phone: emp.phone || "",
      salary: emp.salary || "",
      menttype: emp.menttype || "",
      pannumbert: emp.pannumbert || "",
      status: emp.status || ""
    });
    setShowPopup(true);
  };
  const [addemployee, setAddEmployee] = useState({
  name: "",
  email: "",
  phone: "",
  salary: "",
  menttype: "",
  pannumbert: ""
});

const [addherimage, setAddherImage] = useState(null);
const [profileimage, setProfileImage] = useState(null);
const [addLoading, setAddLoading] = useState(false);
const [addError, setAddError] = useState("");
const handleAddEmployee = async (e) => {
  e.preventDefault();
  setAddLoading(true);
  setAddError("");

  try {
    const formData = new FormData();
    formData.append("name", addemployee.name);
    formData.append("email", addemployee.email);
    formData.append("phone", addemployee.phone);
    formData.append("salary", addemployee.salary);
    formData.append("menttype", addemployee.menttype);
    formData.append("pannumbert", addemployee.pannumbert);
    formData.append("addherimage", addherimage);
    formData.append("profileimage", profileimage);

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8000/employe/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Employee add failed");

    alert("Employee added successfully ✅");
    setShowAddEmployee(false);
    getAllEmployees();

    // reset form
    setAddEmployee({
      name: "",
      email: "",
      phone: "",
      salary: "",
      menttype: "",
      pannumbert: ""
    });
    setAddherImage(null);
    setProfileImage(null);

  } catch (err) {
    setAddError(err.message);
  } finally {
    setAddLoading(false);
  }
};

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 UPDATE EMPLOYEE (same API)
 const handleUpdate = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:8000/employe/updateemployee/${editId}`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Employee updated ✅");
    setShowPopup(false);
    getAllEmployees();
  } catch (err) {
    console.log(err.response?.data || err.message);
    alert("Update failed ❌");
  }
};

  // 🔹 DELETE EMPLOYEE (same)
  const handlestatus = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("token");
            await axios.delete(
        `http://localhost:8000/employe/deleteemployee/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      getAllEmployees();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full ">
     <div className="flex items-center justify-between mb-6 p-5">
       <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Employee Dashboard
      </h1>
       <button
          onClick={()=>setShowAddEmployee(true)}
          className="w-30  h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center cursor-pointer "
        >
          Add Employee
        </button>
     </div>
      {loading ? (
        <p className="text-center">Loading employees...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
          <table className="min-w-full border-collapse">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-4 py-3">Profile</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Salary</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">PAN</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Join Date</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <img
                      src={emp.profileimage}
                      className="w-12 h-12 rounded-full"
                      alt=""
                    />
                  </td>
                  <td className="px-4 py-3">{emp.name}</td>
                  <td className="px-4 py-3">{emp.email}</td>
                  <td className="px-4 py-3">{emp.phone}</td>
                  <td className="px-4 py-3">₹ {emp.salary}</td>
                  <td className="px-4 py-3">{emp.menttype}</td>
                  <td className="px-4 py-3">{emp.pannumbert}</td>
                  <td className="px-4 py-3">{emp.status}</td>
                  <td className="px-4 py-3">
                    {new Date(emp.joindate).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      onClick={() => openEditPopup(emp)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handlestatus(emp._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
     {showaddemployee && ( <div className="fixed inset-0 flex justify-center items-start mt-24 z-50">
      <div className="max-w-4xl mx-auto bg-white p-8 mt-5 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Add New Employee
      </h2>
     <form onSubmit={handleAddEmployee}
      className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <input
  placeholder="Name"
  className="border p-2 rounded"
  value={addemployee.name}
  onChange={(e) =>
    setAddEmployee({ ...addemployee, name: e.target.value })
  }
/>

<input
  placeholder="Email"
  className="border p-2 rounded"
  value={addemployee.email}
  onChange={(e) =>
    setAddEmployee({ ...addemployee, email: e.target.value })
  }
/>

<input
  placeholder="Phone"
  className="border p-2 rounded"
  value={addemployee.phone}
  onChange={(e) =>
    setAddEmployee({ ...addemployee, phone: e.target.value })
  }
/>

<input
  placeholder="Salary"
  className="border p-2 rounded"
  value={addemployee.salary}
  onChange={(e) =>
    setAddEmployee({ ...addemployee, salary: e.target.value })
  }
/>

<select
  className="border p-2 rounded"
  value={addemployee.menttype}
  onChange={(e) =>
    setAddEmployee({ ...addemployee, menttype: e.target.value })
  }
>
  <option value="">Select Type</option>
  <option value="fulltime">Full Time</option>
  <option value="parttime">Part Time</option>
</select>

<input
  placeholder="PAN Number"
  className="border p-2 rounded"
  value={addemployee.pannumbert}
  onChange={(e) =>
    setAddEmployee({ ...addemployee, pannumbert: e.target.value })
  }
/>

<input
  type="file"
  onChange={(e) => setAddherImage(e.target.files[0])}
/>

<input
  type="file"
  onChange={(e) => setProfileImage(e.target.files[0])}
/>

       <button
  type="submit"
  disabled={addLoading}
  className="bg-indigo-600 text-white px-4 py-2 rounded"
>
  {addLoading ? "Saving..." : "Add Employee"}
</button>

<button
  type="button"
  onClick={() => setShowAddEmployee(false)}
  className="bg-gray-300 px-4 py-2 rounded"
>
  Cancel
</button>

      </form>
      </div>
      </div>)}
      {showPopup && (
        <div className="fixed inset-0 flex justify-center items-start mt-24 z-50">
          <div
            className="absolute  bg-opacity-20"
            onClick={() => setShowPopup(false)}
          ></div>

          <div className="relative bg-white w-[420px] p-6 rounded-xl shadow-xl">
            <h2 className="text-lg font-bold mb-4">Edit Employee</h2>

            <form onSubmit={handleUpdate} className="grid gap-3">
              <input name="name" value={form.name} onChange={handleChange} className="border p-2 rounded" placeholder="Name" />
              <input name="phone" value={form.phone} onChange={handleChange} className="border p-2 rounded" placeholder="Phone" />
              <input name="salary" value={form.salary} onChange={handleChange} className="border p-2 rounded" placeholder="Salary" />

              <select name="menttype" value={form.menttype} onChange={handleChange} className="border p-2 rounded">
                <option value="fulltime">Full Time</option>
                <option value="parttime">Part Time</option>
              </select>

              <input name="pannumbert" value={form.pannumbert} onChange={handleChange} className="border p-2 rounded" placeholder="PAN Number" />

              <select name="status" value={form.status} onChange={handleChange} className="border p-2 rounded">
                <option value="pending">Pending</option>
                <option value="active">Active</option>
              </select>

              <div className="flex justify-end gap-3 mt-4">
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
                  Update
                </button>
                <button type="button" onClick={() => setShowPopup(false)} className="bg-gray-300 px-4 py-2 rounded">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
