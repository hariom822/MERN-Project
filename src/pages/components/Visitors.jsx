import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Power, RotateCcw,RefreshCcw } from "lucide-react";

export default function Visitors() {

  const token = localStorage.getItem("token");

  const [visitors, setVisitors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const [search, setSearch] = useState("");
  const [showTrash, setShowTrash] = useState(false);
  const [sortField, setSortField] = useState("name");
  const [profileimage, setProfileImage] = useState(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showConvertPopup, setShowConvertPopup] = useState(false);
  const [studentdata, setStudentData] = useState({
      courseprice: "",
      paymenttype: "",
      paymentmode: "",
      amountpaid: 0,
      duedate: "",
      course: "",
      batch: "",
      city:"",
      pincode:"",
      state:"",
      gender:""
  });
  const [selectedVisitor, setSelectedVisitor] = useState(null);


  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    // coures: "",
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

const convertstudent = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();

    formData.append("courseprice", studentdata.courseprice);
    formData.append("paymenttype", studentdata.paymenttype);
    formData.append("paymentmode", studentdata.paymentmode);
    formData.append("amountpaid", studentdata.amountpaid);
    formData.append("duedate", studentdata.duedate);
    formData.append("course", studentdata.course);
    formData.append("city", studentdata.city);
    formData.append("pincode", studentdata.pincode);
    formData.append("state", studentdata.state);
    formData.append("gender", studentdata.gender);

    // 🔥 IMAGE APPEND
    if (profileimage) {
      formData.append("profileimage", profileimage);
    }

    await axios.post(
      `http://localhost:8000/visitor/convertstudent/${selectedVisitor._id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    setShowConvertPopup(false);
    fetchAll();

  } catch (err) {
    console.error(err);
  }
};


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
        // { headers: { Authorization: `Bearer ${token}` } }
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
              {/* <th>Course</th> */}
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
                {/* <td>{visitor.coures?.coursename || "N/A"}</td> */}
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
                    // onClick={()=>{
                    //   // setSelectedVisitor(visitor);
                    //    setShowConvertPopup(true);
                    //   setForm(visitor);
                    //   // convertstudent(visitor);
                    // }}
                    onClick={()=>{
             setSelectedVisitor(visitor);
  setForm(visitor);
  setShowConvertPopup(true);
}}
                    className="text-indigo-600 mr-3"
                  >
                    <RefreshCcw size={18} />
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
          // courses={courses}
          onSubmit={handleAdd}
          onClose={()=>setShowAddPopup(false)}
        />
      )}

      {showEditPopup && (
        <VisitorPopup
          title="Edit Visitor"
          form={form}
          setForm={setForm}
          // courses={courses}
          onSubmit={handleEdit}
          onClose={()=>setShowEditPopup(false)}
        />
      )}
     {showConvertPopup && (
  <div className="fixed inset-0 bg-black/40 overflow-y-auto backdrop-blur-sm flex justify-center items-center z-50">
    
    <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-fadeIn">
      
      <h2 className="text-xl font-bold mb-2 text-gray-800">
        Convert to Student
      </h2>

      <p className="text-gray-600 mb-6">
        Are you sure you want to convert{" "}
        <span className="font-semibold text-indigo-600">
          {form.name}
        </span>{" "}
        to a student?
      </p>

      <form
        onSubmit={convertstudent}
        className="space-y-4"
      >
        {/* Payment Type */}
        <select
          name="paymenttype"
          value={studentdata.paymenttype}
          onChange={(e) => setStudentData({...studentdata, paymenttype: e.target.value})}
          className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="full">Full Payment</option>
          <option value="installment">Installment</option>
        </select>

        {/* Payment Mode */}
        <select
          name="paymentmode"
          value={studentdata.paymentmode}
          onChange={(e) => setStudentData({...studentdata, paymentmode: e.target.value})}
          className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="online">Online</option>
        </select>

        {/* Amount Fields */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            value={studentdata.amountpaid || 0}
            onChange={(e) => setStudentData({...studentdata, amountpaid: e.target.value})}
            placeholder="Amount Paid"
            className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <input
            type="number"
            value={studentdata.courseprice || 0}
            onChange={(e) => setStudentData({...studentdata, courseprice: e.target.value})}
            placeholder="Total Amount"
            className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
         <select
            value={studentdata.course}
            onChange={(e)=>setStudentData({...studentdata,course:e.target.value})}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Course</option>
            {courses.map(c=>(
              <option key={c._id} value={c._id}>
                {c.coursename}
              </option>
            ))}
          </select>
        {/* Status */}
        <select
          name="status"
          value={studentdata.status}
          onChange={(e) => setStudentData({...studentdata, status: e.target.value})}
          className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
        </select>

        {/* Due Date */}
        <input
          type="date"
          value={studentdata.duedate}
          onChange={(e) => setStudentData({...studentdata, duedate: e.target.value})}
          className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        />
         <input
          type="text"
          value={studentdata.city}
          onChange={(e) => setStudentData({...studentdata, city: e.target.value})}
          className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        placeholder="Enter City"/>
         <input
          type="text"
          value={studentdata.pincode}
          onChange={(e) => setStudentData({...studentdata, pincode: e.target.value})}
          className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
         placeholder="Enter Pincode"/>
         
         <input
          type="text"
          value={studentdata.state}
          onChange={(e) => setStudentData({...studentdata, state: e.target.value})}
          className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
         placeholder="Enter State"/>
         <input
          type="text"
          value={studentdata.gender}
          onChange={(e) => setStudentData({...studentdata, gender: e.target.value})}
          className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
         placeholder="Enter Gender"/>
          <div>
              <label className="text-sm text-gray-600">Profile Image</label>
              <input
                type="file"
                onChange={(e)=>setProfileImage(e.target.files[0])}
                className="w-full"
                required
              />
            </div>
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"

            onClick={() => setShowConvertPopup(false)}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition"
          >
            Close
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
          >
            Convert
          </button>
        </div>
      </form>

    </div>
  </div>
)}

    </div>
  );
}

/* 🔹 Popup Component */
function VisitorPopup({ title, form, setForm,  onSubmit, onClose }) {
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

          {/* <select
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
          </select> */}

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
