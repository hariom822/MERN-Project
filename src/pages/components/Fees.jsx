import { useEffect, useState, useMemo } from "react";
import axios from "axios";

export default function Fees() {

  const [feesData, setFeesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);

  const [paymentData, setPaymentData] = useState({
    amountpaid: 0,
    paymenttype: "full",
    paymentmode: "cash",
    duedate: ""
  });

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("http://localhost:8000/feesh/findall");
      setFeesData(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch fees data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8000/feesh/", {
        student: selectedFee.student._id,
        courseprice: selectedFee.courseprice,
        amountpaid: Number(paymentData.amountpaid),
        paymenttype: paymentData.paymenttype,
        paymentmode: paymentData.paymentmode,
        duedate: paymentData.duedate
      });

      setShowPaymentPopup(false);
      fetchFees();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };
const email=localStorage.getItem("email")
  // 🔎 SEARCH + SORT (Logic change nahi kiya, sirf filtering added)
  const processedFees = useMemo(() => {

    let data = [...feesData];

    // 🔎 Searching
    if (searchTerm) {
      data = data.filter(fee =>
        fee.student?.visitorId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fee.student?.course?.coursename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fee.student?.batch?.batchName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 🔃 Sorting
    if (sortOption === "newest") {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (sortOption === "oldest") {
      data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    if (sortOption === "total-high") {
      data.sort((a, b) => b.courseprice - a.courseprice);
    }

    if (sortOption === "total-low") {
      data.sort((a, b) => a.courseprice - b.courseprice);
    }

    if (sortOption === "paid-high") {
      data.sort((a, b) => b.amountpaid - a.amountpaid);
    }

    if (sortOption === "paid-low") {
      data.sort((a, b) => a.amountpaid - b.amountpaid);
    }

    return data;

  }, [feesData, searchTerm, sortOption]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">
        Student Fees Management
      </h1>

      {/* 🔎 Search + Sort */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by student, course, batch..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="total-high">Total High → Low</option>
          <option value="total-low">Total Low → High</option>
          <option value="paid-high">Paid High → Low</option>
          <option value="paid-low">Paid Low → High</option>
        </select>
      </div>

      {/* Loading */}
      {loading && <p className="text-blue-600">Loading...</p>}

      {/* Error */}
      {error && <p className="text-red-600">{error}</p>}

      <div className="bg-white rounded-xl shadow-xl overflow-hidden">

        <table className="w-full">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-3">Student</th>
              <th className="p-3">Course</th>
              <th className="p-3">Batch</th>
              <th className="p-3">Total</th>
              <th className="p-3">Paid</th>
              <th className="p-3">Remaining</th>
              <th className="p-3">Status</th>
              <th className="p-3">Due Date</th>
              <th className="p-3">Created</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

        <tbody>
  {processedFees
    .filter(fee => fee.student) 
    .map((fee) => {

      const previousPayments = feesData
        .filter(f =>
          f.student?._id === fee.student?._id &&
          new Date(f.createdAt) <= new Date(fee.createdAt)
        )
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      const totalPaidTillNow = previousPayments.reduce(
        (sum, p) => sum + (p.amountpaid || 0),
        0
      );

      const remaining = (fee.courseprice || 0) - totalPaidTillNow;

      const status =
        remaining <= 0
          ? "paid"
          : totalPaidTillNow > 0
          ? "partial"
          : "unpaid";

      return (
        <tr key={fee._id} className="border-b hover:bg-gray-50">

          <td className="p-3">
            {fee.student?.visitorId?.name || "-"}
          </td>

          <td className="p-3">
            {fee.student?.course?.coursename || "-"}
          </td>

          <td className="p-3">
            {fee.student?.batch?.batchName || "-"}
          </td>

          <td className="p-3 font-semibold">
            ₹{fee.courseprice || 0}
          </td>

          <td className="p-3 text-green-600">
            ₹{fee.amountpaid || 0}
          </td>

          <td className="p-3 text-red-600 font-semibold">
            ₹{remaining >= 0 ? remaining : 0}
          </td>

          <td className="p-3">
            {status === "paid" && (
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                Completed
              </span>
            )}
            {status === "partial" && (
              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">
                Partial
              </span>
            )}
            {status === "unpaid" && (
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                Unpaid
              </span>
            )}
          </td>

          <td className="p-3">
            {fee.duedate
              ? new Date(fee.duedate).toLocaleDateString()
              : "-"}
          </td>

          <td className="p-3 text-gray-500 text-sm">
            {fee.createdAt
              ? new Date(fee.createdAt).toLocaleDateString()
              : "-"}
          </td>

          <td className="p-3">
            <button
              onClick={() => {
                setSelectedFee(fee);
                setShowPaymentPopup(true);
              }}
              className="text-blue-600"
            >
              Add Payment
            </button>
          </td>

        </tr>
      );
    })}
</tbody>

        </table>
      </div>

      {/* PAYMENT POPUP SAME */}
      {showPaymentPopup && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add Payment</h2>

            <form onSubmit={handleAddPayment} className="space-y-4">

              <input
                type="number"
                placeholder="Amount Paid"
                value={paymentData.amountpaid}
                onChange={(e) =>
                  setPaymentData({
                    ...paymentData,
                    amountpaid: e.target.value
                  })
                }
                className="w-full border px-3 py-2 rounded"
                required
              />

              <input
                type="date"
                value={paymentData.duedate}
                onChange={(e) =>
                  setPaymentData({
                    ...paymentData,
                    duedate: e.target.value
                  })
                }
                className="w-full border px-3 py-2 rounded"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPaymentPopup(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  Save
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}