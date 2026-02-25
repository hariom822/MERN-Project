import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentDashboard() {
  const [fees, setFees] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    axios.get("http://localhost:8000/feesh/findall")
      .then(res => setFees(res.data));
  }, []);

  const totalPaid = fees.reduce((sum,f)=>sum+f.amountpaid,0);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Paid</p>
          <h3 className="text-2xl font-bold text-green-600">₹{totalPaid}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Classes</p>
          <h3 className="text-2xl font-bold text-indigo-600">12</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Attendance</p>
          <h3 className="text-2xl font-bold text-yellow-600">85%</h3>
        </div>
      </div>
    </div>
  );
}

