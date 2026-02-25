import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentCourse() {

  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);

  const emailid = localStorage.getItem("email");

  useEffect(() => {
    fetchCourse();
  }, []);

  const fetchCourse = async () => {
    try {
      const res = await axios.get("http://localhost:8000/feesh/findall");

      const myData = res.data.find(
        fee =>
          fee?.student?.visitorId?.email?.toLowerCase() ===
          emailid?.toLowerCase()
      );

      setCourseData(myData);

    } catch (error) {
      console.error("Course fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!courseData) {
    return (
      <div className="text-center mt-10 text-gray-500">
        No course data found.
      </div>
    );
  }

  const course = courseData.student?.course;
  const batch = courseData.student?.batch;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-8">

      <div className="max-w-5xl mx-auto space-y-8">

        <h2 className="text-3xl font-bold text-indigo-600 mb-6">
          My Course
        </h2>

        {/* ================= COURSE CARD ================= */}
        <div className="bg-white shadow-xl rounded-2xl p-6">

          <div className="grid md:grid-cols-2 gap-6 text-gray-700">

            <div>
              <p><strong>Course Name:</strong> {course?.coursename}</p>
              <p><strong>Duration:</strong> {course?.duration}</p>
              <p><strong>Level:</strong> {course?.level}</p>
              <p><strong>Total Course Fees:</strong> ₹{course?.fees}</p>
            </div>

            <div>
              <p><strong>Batch Name:</strong> {batch?.batchName}</p>
              <p><strong>Start Date:</strong> {batch?.startDate ? new Date(batch.startDate).toLocaleDateString() : "N/A"}</p>
              <p><strong>Enrollment Date:</strong> {new Date(courseData.student?.date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {courseData.student?.status}</p>
            </div>

          </div>
        </div>

        {/* ================= EXTRA INFO SECTION ================= */}
        <div className="grid md:grid-cols-3 gap-6">

          <InfoCard title="Course Duration" value={course?.duration} />
          <InfoCard title="Batch" value={batch?.batchName} />
          <InfoCard title="Current Status" value={courseData.student?.status} />

        </div>

      </div>
    </div>
  );
}

/* 🔥 Small Card Component */

function InfoCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow text-center hover:shadow-xl transition">
      <p className="text-gray-500">{title}</p>
      <h3 className="text-xl font-bold text-indigo-600 mt-2">
        {value || "N/A"}
      </h3>
    </div>
  );
}
