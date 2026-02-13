import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {

  const [employees, setEmployees] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [skills, setSkills] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const emp = await axios.get(
        "http://localhost:8000/employe/allemployee",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmployees(emp.data);

      const stu = await axios.get(
        "http://localhost:8000/student/findall",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents(stu.data);

      const cou = await axios.get(
        "http://localhost:8000/course/allcourse",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourses(cou.data);

      const ski = await axios.get(
        "http://localhost:8000/skill/findall",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSkills(ski.data);

    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const activeStudents = students.filter(s => s.isactive);
  const trashStudents = students.filter(s => !s.isactive);
  const activeCourses = courses.filter(c => c.status === "active");

  const totalRevenue = students.reduce(
    (sum, s) => sum + (s.fees || 0),
    0
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Admin Dashboard
      </h1>

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (

        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">

            <StatCard title="Employees" value={employees.length} color="bg-black" />
            <StatCard title="Active Students" value={activeStudents.length} color="bg-black" />
            <StatCard title="Trash Students" value={trashStudents.length} color="bg-black" />
            <StatCard title="Courses" value={courses.length} color="bg-black" />
            <StatCard title="Revenue" value={`₹ ${totalRevenue}`} color="bg-black" />
          </div>
          <SectionTable
            title="Recent Students"
            data={students.slice(0, 5)}
            type="student"
          />

          <SectionTable
            title="Recent Employees"
            data={employees.slice(0, 5)}
            type="employee"
          />

          {/* ACTIVE COURSES */}
          <SectionTable
            title="Active Courses"
            data={activeCourses}
            type="course"
          />
        </>
      )}
    </div>
  );
}


/* 🔹 Reusable Stat Card */
function StatCard({ title, value, color }) {
  return (
    <div className={`${color} text-white rounded-xl shadow-lg p-6`}>
      <h3 className="text-sm uppercase opacity-80">
        {title}
      </h3>
      <p className="text-3xl font-bold mt-2">
        {value}
      </p>
    </div>
  );
}


/* 🔹 Reusable Table Section */
function SectionTable({ title, data, type }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {title}
      </h2>

      <table className="w-full">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Name</th>
            {type === "student" && <th>Email</th>}
            {type === "employee" && <th>Phone</th>}
            {type === "course" && <th>Duration</th>}
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item._id} className="border-b">
              <td className="py-2">{item.name || item.coursename}</td>

              {type === "student" && (
                <td>{item.email}</td>
              )}

              {type === "employee" && (
                <td>{item.phone}</td>
              )}

              {type === "course" && (
                <td>{item.duration}</td>
              )}

              <td>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                  {item.status || (item.isactive ? "Active" : "Inactive")}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
