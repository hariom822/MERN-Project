import { useEffect, useState } from "react";
import axios from "axios";

export default function MyFees() {

  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  const emailid = localStorage.getItem("email");

  useEffect(() => {
    fetchMyFees();
  }, []);

  const fetchMyFees = async () => {
    try {
      const res = await axios.get("http://localhost:8000/feesh/findall");

      // ✅ Safe filtering + case insensitive match
      const myFees = res.data.filter(
        fee =>
          fee?.student?.visitorId?.email?.toLowerCase() ===
          emailid?.toLowerCase()
      );

      setFees(myFees);

    } catch (error) {
      console.error("Error fetching fees:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (fees.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-500">
        No fees record found.
      </div>
    );
  }

  // 🔥 Calculate totals
  const totalAmount = fees.reduce((sum, f) => sum + Number(f.courseprice || 0), 0);
  const totalPaid = fees.reduce((sum, f) => sum + Number(f.amountpaid || 0), 0);
  const totalRemaining = totalAmount - totalPaid;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-8">

      <h2 className="text-2xl font-bold mb-8 text-gray-800">
        My Fee Details
      </h2>

      {/* 🔥 Summary Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <SummaryCard title="Total Fee" value={totalAmount} color="indigo" />
        <SummaryCard title="Total Paid" value={totalPaid} color="green" />
        <SummaryCard title="Total Remaining" value={totalRemaining} color="red" />

      </div>

      {/* 🔥 Fee Cards */}
      <div className="grid md:grid-cols-2 gap-6">

        {fees.map(fee => {

          const remaining = fee.courseprice - fee.amountpaid;

          const status =
            remaining <= 0
              ? "Paid"
              : fee.amountpaid > 0
              ? "Partial"
              : "Unpaid";

          return (
            <div
              key={fee._id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
            >

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-indigo-600">
                  {fee.student?.course?.coursename || "Course"}
                </h3>
                <p className="text-sm text-gray-500">
                  Batch: {fee.student?.batch?.batchName || "N/A"}
                </p>
              </div>

              <div className="space-y-2 text-gray-700">

                <Row label="Total Fee" value={`₹${fee.courseprice}`} />
                <Row label="Paid" value={`₹${fee.amountpaid}`} green />
                <Row label="Remaining" value={`₹${remaining}`} red />

                <div className="pt-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    status === "Paid"
                      ? "bg-green-100 text-green-600"
                      : status === "Partial"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }`}>
                    {status}
                  </span>
                </div>

              </div>
            </div>
          );
        })}

      </div>

    </div>
  );
}

/* 🔥 Small Components */

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

function Row({ label, value, green, red }) {
  return (
    <p className="flex justify-between">
      <span>{label}:</span>
      <span className={`font-medium ${
        green ? "text-green-600" : red ? "text-red-600" : ""
      }`}>
        {value}
      </span>
    </p>
  );
}
