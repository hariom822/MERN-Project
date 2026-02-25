import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axioss from "../../utils/axiosInstance";

export default function Dashboard() {

  const token = localStorage.getItem("token");
  const navigate=useNavigate()
  const [stats, setStats] = useState({
    students: 0,
    visitors: 0,
    courses: 0,
    batches: 0,
    activeStudents: 0,
    inactiveStudents: 0,
    revenue: 0,
  });

  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(!token){
      alert("plese first login")
      navigate("/login");
    }
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {

      const [studentRes, visitorRes, courseRes, batchRes] =
      
        await Promise.all([
          axios.get("http://localhost:8000/student/findall", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/visitor/allvisitor"),
          axios.get("http://localhost:8000/course/allcourse"),
          axios.get("http://localhost:8000/batch/allbatch"),
        ]);

      const students = studentRes.data;

      const active = students.filter(s => s.isactive).length;
      const inactive = students.filter(s => !s.isactive).length;

      const totalRevenue = students.reduce(
        (sum, s) => sum + (Number(s.fees) || 0),
        0
      );

      setStats({
        students: students.length,
        visitors: visitorRes.data.length,
        courses: courseRes.data.length,
        batches: batchRes.data.length,
        activeStudents: active,
        inactiveStudents: inactive,
        revenue: totalRevenue,
      });

      setRecentStudents(students.slice(-5).reverse());

    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold text-gray-800 mb-10">
        Admin Dashboard
      </h1>

      {loading ? (
        <div className="text-center text-gray-500">
          Loading dashboard...
        </div>
      ) : (
        <>
          {/* ================= STATS GRID ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

            <StatCard title="Total Students" value={stats.students} />
            <StatCard title="Total Visitors" value={stats.visitors} />
            <StatCard title="Total Courses" value={stats.courses} />
            <StatCard title="Total Batches" value={stats.batches} />

          </div>

          {/* ================= SECOND ROW ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

            <BigCard
              title="Active Students"
              value={stats.activeStudents}
            />

            <BigCard
              title="Inactive Students"
              value={stats.inactiveStudents}
            />

            <BigCard
              title="Total Revenue"
              value={`₹${stats.revenue}`}
            />

          </div>

          {/* ================= RECENT STUDENTS TABLE ================= */}
          <div className="bg-white rounded-2xl shadow-md p-6">

            <h2 className="text-xl font-semibold mb-6 text-gray-700">
              Recent Students
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full">

                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentStudents.map(student => (
                    <tr key={student._id} className="border-b">
                      <td className="px-4 py-3">
                        {student.visitorId?.name}
                      </td>
                      <td>{student.visitorId?.email}</td>
                      <td>{student.visitorId?.phone}</td>
                      <td>
                        <span className={`px-2 py-1 rounded text-sm ${
                          student.isactive
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}>
                          {student.isactive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ================= SMALL CARD ================= */
function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-3xl font-bold text-indigo-600 mt-2">
        {value}
      </h2>
    </div>
  );
}

/* ================= BIG CARD ================= */
function BigCard({ title, value }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition text-center">
      <p className="text-gray-500 mb-3">{title}</p>
      <h2 className="text-4xl font-bold text-indigo-600">
        {value}
      </h2>
    </div>
    
  );
}
