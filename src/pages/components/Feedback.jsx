import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import moment from "moment";

export default function Feedback() {

  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [attendance, setAttendance] = useState(null);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");

  // =========================
  // Fetch Courses
  // =========================
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const res = await axios.get("http://localhost:8000/course/allcourse");
    setCourses(res.data);
  };

  const fetchBatches = async (courseId) => {
    const res = await axios.get("http://localhost:8000/batch/allbatch");
    const filtered = res.data.filter(b =>
      String(b.course?._id || b.course) === String(courseId)
    );
    setBatches(filtered);
  };

  const fetchDates = async () => {
    if (!selectedBatch || !selectedCourse) return;

    const res = await axios.get(
      "http://localhost:8000/attendance/dates",
      {
        params: { batch: selectedBatch, course: selectedCourse }
      }
    );

    setAvailableDates(res.data);
  };

  const fetchAttendance = async () => {
    if (!selectedBatch || !selectedCourse || !selectedDate) return;

    const res = await axios.get(
      "http://localhost:8000/attendance/check",
      {
        params: {
          batch: selectedBatch,
          course: selectedCourse,
          date: selectedDate
        }
      }
    );

    setAttendance(res.data.data);
  };

  useEffect(() => {
    if (selectedCourse) {
      fetchBatches(selectedCourse);
      setSelectedBatch("");
      setSelectedDate("");
      setAttendance(null);
    }
  }, [selectedCourse]);

  useEffect(() => {
    fetchDates();
    setSelectedDate("");
    setAttendance(null);
  }, [selectedBatch]);

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  // =========================
  // Summary
  // =========================
  const summary = useMemo(() => {

    if (!attendance) return { present: 0, absent: 0, online: 0 };

    let present = 0;
    let absent = 0;
    let online = 0;

    attendance.students.forEach(s => {
      if (s.status === "present") present++;
      if (s.status === "absent") absent++;
      if (s.status === "online") online++;
    });

    return { present, absent, online };

  }, [attendance]);

  // =========================
  // Render
  // =========================
  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">
        Attendance Feedback Dashboard
      </h1>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow mb-6 flex gap-4 flex-wrap">

        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="">Select Course</option>
          {courses.map(c => (
            <option key={c._id} value={c._id}>
              {c.coursename}
            </option>
          ))}
        </select>

        {selectedCourse && (
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="border px-4 py-2 rounded"
          >
            <option value="">Select Batch</option>
            {batches.map(b => (
              <option key={b._id} value={b._id}>
                {b.batchName}
              </option>
            ))}
          </select>
        )}

        {selectedBatch && (
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border px-4 py-2 rounded"
          >
            <option value="">Select Attendance Date</option>
            {availableDates.map(d => (
              <option key={d._id} value={d.date}>
                {moment(d.date).format("DD MMM YYYY")}
              </option>
            ))}
          </select>
        )}

        {attendance && (
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="border px-4 py-2 rounded"
          >
            <option value="">All Students</option>
            {attendance.students.map(s => (
              <option key={s._id} value={s.student._id}>
                {s.student?.visitorId?.name}
              </option>
            ))}
          </select>
        )}

      </div>

      {/* Summary */}
      {attendance && (
        <div className="grid grid-cols-3 gap-6 mb-6">

          <div className="bg-green-100 p-6 rounded text-center">
            <h2 className="text-2xl font-bold">{summary.present}</h2>
            <p>Present</p>
          </div>

          <div className="bg-red-100 p-6 rounded text-center">
            <h2 className="text-2xl font-bold">{summary.absent}</h2>
            <p>Absent</p>
          </div>

          <div className="bg-blue-100 p-6 rounded text-center">
            <h2 className="text-2xl font-bold">{summary.online}</h2>
            <p>Online</p>
          </div>

        </div>
      )}

      {/* Table */}
      {attendance && (
        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-lg font-bold mb-4">
            {moment(attendance.date).format("DD MMM YYYY")}
          </h2>

          <table className="w-full border">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Phone</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.students
                .filter(s =>
                  selectedStudent
                    ? s.student._id === selectedStudent
                    : true
                )
                .map(s => (
                  <tr key={s._id} className="border-b">

                    <td className="p-2">
                      {s.student?.visitorId?.name}
                    </td>

                    <td className="p-2">
                      {s.student?.visitorId?.email}
                    </td>

                    <td className="p-2">
                      {s.student?.visitorId?.phone}
                    </td>

                    <td className={`p-2 font-semibold ${
                      s.status === "present"
                        ? "text-green-600"
                        : s.status === "absent"
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}>
                      {s.status.toUpperCase()}
                    </td>

                  </tr>
                ))}
            </tbody>
          </table>

        </div>
      )}

      {selectedDate && !attendance && (
        <p className="text-gray-500">
          No attendance found for this date.
        </p>
      )}

    </div>
  );
}