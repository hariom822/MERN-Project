import { useEffect, useState } from "react";
import axios from "axios";

export default function MyProfile() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const emailid = localStorage.getItem("email");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:8000/feesh/findall");

      // 🔥 Match by email
      const myData = res.data.find(
        fee =>
          fee?.student?.visitorId?.email?.toLowerCase() ===
          emailid?.toLowerCase()
      );

      setData(myData);

    } catch (error) {
      console.error("Profile error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!data) {
    return <div className="text-center mt-10">No profile data found</div>;
  }

  const remaining = data.courseprice - data.amountpaid;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-8">

      <div className="max-w-5xl mx-auto space-y-8">

        {/* ================= USER INFO ================= */}
        <div className="bg-white shadow-xl rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-indigo-600 mb-6">
            My Profile
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-gray-700">

            <div>
              <p><strong>Name:</strong> {data.student?.visitorId?.name}</p>
              <p><strong>Email:</strong> {data.student?.visitorId?.email}</p>
              <p><strong>Phone:</strong> {data.student?.visitorId?.phone}</p>
            </div>

            <div>
              <p><strong>Status:</strong> {data.student?.status}</p>
              <p><strong>Active:</strong> {data.student?.isactive ? "Yes" : "No"}</p>
              <p><strong>Joined On:</strong> {new Date(data.student?.date).toLocaleDateString()}</p>
            </div>

          </div>
        </div>

        {/* ================= COURSE INFO ================= */}
        <div className="bg-white shadow-xl rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-indigo-600 mb-6">
            Course & Batch
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-gray-700">

            <div>
              <p><strong>Course:</strong> {data.student?.course?.coursename}</p>
              <p><strong>Duration:</strong> {data.student?.course?.duration}</p>
              <p><strong>Level:</strong> {data.student?.course?.level}</p>
            </div>

            <div>
              <p><strong>Batch:</strong> {data.student?.batch?.batchName}</p>
              <p><strong>Start Date:</strong> {new Date(data.student?.batch?.startDate).toLocaleDateString()}</p>
            </div>

          </div>
        </div>

        {/* ================= FEE SUMMARY ================= */}
        <div className="bg-white shadow-xl rounded-2xl p-6">

          <h2 className="text-xl font-semibold text-indigo-600 mb-6">
            Fee Summary
          </h2>

          <div className="grid md:grid-cols-3 gap-6 text-center">

            <SummaryCard title="Total Fee" value={data.courseprice} color="indigo" />
            <SummaryCard title="Paid" value={data.amountpaid} color="green" />
            <SummaryCard title="Remaining" value={remaining} color="red" />

          </div>

          <div className="mt-6 text-gray-700 space-y-2">
            <p><strong>Payment Type:</strong> {data.paymenttype}</p>
            <p><strong>Payment Mode:</strong> {data.paymentmode}</p>
            <p><strong>Status:</strong> {data.status}</p>
            <p><strong>Due Date:</strong> {new Date(data.duedate).toLocaleDateString()}</p>
          </div>

        </div>

      </div>
    </div>
  );
}

/* ================= SMALL COMPONENT ================= */

function SummaryCard({ title, value, color }) {

  const colorMap = {
    indigo: "text-indigo-600 bg-indigo-50",
    green: "text-green-600 bg-green-50",
    red: "text-red-600 bg-red-50",
  };

  return (
    <div className={`p-6 rounded-2xl shadow ${colorMap[color]}`}>
      <p className="text-gray-600">{title}</p>
      <h3 className="text-2xl font-bold mt-2">₹{value}</h3>
    </div>
  );
}
