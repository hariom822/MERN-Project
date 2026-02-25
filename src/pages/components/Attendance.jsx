import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import moment from "moment";

export default function Attendance() {

  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [timetables, setTimetables] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");

  const [attendanceData, setAttendanceData] = useState({});
  const [existingAttendanceMap, setExistingAttendanceMap] = useState({});

  // ===============================
  // Fetch Initial Data
  // ===============================
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [courseRes, batchRes, studentRes, timetableRes] =
      await Promise.all([
        axios.get("http://localhost:8000/course/allcourse"),
        axios.get("http://localhost:8000/batch/allbatch"),
        axios.get("http://localhost:8000/student/findall"),
        axios.get("http://localhost:8000/timetable/findall")
      ]);

    setCourses(courseRes.data);
    setBatches(batchRes.data);
    setStudents(studentRes.data);
    setTimetables(timetableRes.data.filter(t => !t.isdeleted));
  };

  // ===============================
  // Filtered Batches by Course
  // ===============================
  const filteredBatches = useMemo(() => {
    return batches.filter(b =>
      String(b.course?._id || b.course) === String(selectedCourse)
    );
  }, [batches, selectedCourse]);

  // ===============================
  // Selected Batch Data
  // ===============================
  const selectedBatchData = useMemo(() => {
    return batches.find(b => String(b._id) === String(selectedBatch));
  }, [batches, selectedBatch]);

  // ===============================
  // Timetables for Batch
  // ===============================
  const batchTimetables = useMemo(() => {
    return timetables.filter(t =>
      String(t.batch?._id || t.batch) === String(selectedBatch)
    );
  }, [timetables, selectedBatch]);

  // ===============================
  // Students of Batch
  // ===============================
  const batchStudents = useMemo(() => {
    return students.filter(s =>
      String(s.batch?._id || s.batch) === String(selectedBatch)
    );
  }, [students, selectedBatch]);

  // ===============================
  // Generate Valid Dates
  // ===============================
const validDates = useMemo(() => {

  if (!selectedBatchData || batchTimetables.length === 0) return [];

  const result = [];

  const start = moment(selectedBatchData.startDate).startOf("day");
  const end = moment(selectedBatchData.endDate).startOf("day");
  const today = moment().startOf("day");

  const allowedDays = batchTimetables.flatMap(t =>
    t.schedule.map(s => s.day.toLowerCase())
  );

  let current = start.clone();

  const loopEnd = moment.min(end, today);

  while (current.isSameOrBefore(loopEnd)) {

    const currentDay = current.format("dddd").toLowerCase();

    if (allowedDays.includes(currentDay)) {
      result.push(current.clone());
    }

    current.add(1, "day");
  }

  return result;

}, [selectedBatchData, batchTimetables]);
console.log(moment().format("YYYY-MM-DD"));
console.log(moment("2026-03-05").isAfter(moment(), "day"));
  // ===============================
  // Fetch Old Attendance
  // ===============================
  useEffect(() => {

    if (!selectedBatch || !selectedCourse || validDates.length === 0)
      return;

    const fetchOldAttendance = async () => {

      let tempMap = {};

      for (let date of validDates) {

        const dateKey = date.format("YYYY-MM-DD");

        try {
          const res =await axios.get("http://localhost:8000/attendance/check",
            {
              params: {
                batch: selectedBatch,
                course: selectedCourse,
                date: dateKey
              }
            }
          );

          if (res.data && res.data.data) {
            tempMap[dateKey] = res.data.data;
          }

        } catch (err) {
          // No attendance found
        }
      }

      setExistingAttendanceMap(tempMap);
    };

    fetchOldAttendance();

  }, [selectedBatch, selectedCourse, validDates]);

  // ===============================
  // Status Change
  // ===============================
  const handleStatusChange = (dateKey, studentId, value) => {

    setAttendanceData(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [studentId]: value
      }
    }));
  };

  const handleSubmit = async (dateKey) => {

    const studentsForDate = batchStudents.map(student => ({

      student: student._id,

      status:
        attendanceData[dateKey]?.[student._id] ||
        existingAttendanceMap[dateKey]?.students.find(
          s => String(s.student) === String(student._id)
        )?.status ||
        "present"
    }));

    const payload = {
      batch: selectedBatch,
      course: selectedCourse,
      date: dateKey,
      students: studentsForDate
    };

    if (existingAttendanceMap[dateKey]) {

      await axios.put(
        `http://localhost:8000/attendance/update/${existingAttendanceMap[dateKey]._id}`,
        payload
      );
      
      alert("Attendance Updated");

    } else {

      const res = await axios.post(
        "http://localhost:8000/attendance/",
        payload
      );

      setExistingAttendanceMap(prev => ({
        ...prev,
        [dateKey]: res.data.data
      }));

      alert("Attendance Submitted");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">
        Attendance Management
      </h1>

      <div className="bg-white p-6 rounded-xl shadow mb-6 flex gap-4">

        <select
          value={selectedCourse}
          onChange={(e) => {
            setSelectedCourse(e.target.value);
            setSelectedBatch("");
          }}
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
            {filteredBatches.map(b => (
              <option key={b._id} value={b._id}>
                {b.batchName}
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedBatch && validDates.length > 0 && (

        <div className="bg-white p-6 rounded-xl shadow overflow-auto">

          <table className="min-w-full border text-sm">

            <thead className="bg-indigo-600 text-white">

              <tr>
                <th className="border p-2">Student</th>

                {validDates.map((date, i) => {

                  const dateKey = date.format("YYYY-MM-DD");

                  return (
                    <th key={i} className="border p-2">
                      {date.format("DD MMM")}
                      <div className="mt-2">
                        <button
                          onClick={() => handleSubmit(dateKey)}
                          className="bg-green-600 text-white px-2 py-1 text-xs rounded"
                        >
                          {existingAttendanceMap[dateKey]
                            ? "Update"
                            : "Submit"}
                        </button>
                      </div>
                    </th>
                  );
                })}

              </tr>

            </thead>

            <tbody>

              {batchStudents.map(student => (

                <tr key={student._id}>

                  <td className="border p-2">
                    {student.visitorId?.name}
                  </td>

                  {validDates.map((date, index) => {

                    const dateKey = date.format("YYYY-MM-DD");

                   const existingStudents =
  existingAttendanceMap[dateKey]?.students || [];

const existingStatus =
  existingStudents.find(
    s => String(s.student) === String(student._id)
  )?.status;

                    return (
                      <td key={index} className="border p-1 text-center">
                        <select
                          className="border rounded px-1 py-1"
                          value={
                            attendanceData[dateKey]?.[student._id] ||
                            existingStatus ||
                            "present"
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              dateKey,
                              student._id,
                              e.target.value
                            )
                          }
                        >
                          <option value="present">P</option>
                          <option value="absent">A</option>
                          <option value="online">O</option>
                        </select>
                      </td>
                    );
                  })}

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}
     
      {selectedBatch && validDates.length === 0 && (
        <p className="text-gray-500 mt-6">
          No attendance records found.
        </p>
      )}

    </div>
  );
}