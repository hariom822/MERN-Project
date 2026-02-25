import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function Timetable() {

  const token = localStorage.getItem("token");

  const [events, setEvents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");

  const [showPopup, setShowPopup] = useState(false);

  const [form, setForm] = useState({
    days: [],
    dayTimes: {},
    tutor: ""
  });

  useEffect(() => {
    fetchCourses();
    fetchTutors();
    fetchTimetable();
    fetchStudents();
  }, []);
  const fetchStudents = async () => {
  const res = await axios.get("http://localhost:8000/student/findall");
  console.log(res.data)
  setStudents(res.data);
};
  useEffect(() => {
    if (selectedCourse) fetchBatches();
  }, [selectedCourse]);

  const fetchCourses = async () => {
    const res = await axios.get("http://localhost:8000/course/allcourse");
    setCourses(res.data);
  };

  const fetchBatches = async () => {
    const res = await axios.get("http://localhost:8000/batch/allbatch");
    setBatches(res.data);
    console.log(res.data)
  };

  const fetchTutors = async () => {
    const res = await axios.get(
      "http://localhost:8000/tutor/findall",
      // { headers: { Authorization: `Bearer ${token}` } }
    );
    setTutors(res.data);
  };

  const fetchTimetable = async () => {
    const res = await axios.get(
      "http://localhost:8000/timetable/findall"
    );

    const formatted = res.data
      .filter(t => !t.isdeleted)
      .flatMap(t =>
        t.schedule.map(s => {

          const start = moment()
            .day(s.day)
            .set({
              hour: moment(s.time, "HH:mm").hour(),
              minute: moment(s.time, "HH:mm").minute()
            });

          return {
            id: t._id + s.day,
            title: `${t.course?.coursename}  - ${s.time}`,
            start: start.toDate(),
            end: moment(start).add(1, "hour").toDate()
          };
        })
      );

    setEvents(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(
      "http://localhost:8000/timetable/",
      {
        ...form,
        course: selectedCourse,
        batch: selectedBatch
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setShowPopup(false);
    fetchTimetable();
  };
  const batchStudents = students.filter(
  s => s.batch === selectedBatch
);


  return (
    <div className=" p-8 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Timetable Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage course schedules and tutors
        </p>
      </div>

      {/* COURSE & BATCH SELECT */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6 flex justify-between items-center">

        <div className="flex gap-4">
          <select
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
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
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Select Batch</option>
              {batches.map(b => (
                <option key={b._id} value={b._id}>
                  {b.batchName}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* {selectedCourse && selectedBatch && (
          <button
            onClick={() => setShowPopup(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition"
          >
            + Add Timetable
          </button>
        )} */}

      </div>

      {/* CALENDAR */}
      {selectedCourse && selectedBatch && (
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <Calendar
            key={events.length}
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 650 }}
            views={["month", "week", "day"]}
            popup
          />
        </div>
      )}

      {/* POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl p-8 shadow-2xl">

            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Add Timetable
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Days */}
              <div>
                <label className="block font-medium mb-3 text-gray-600">
                  Select Days
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
                    .map(day => (
                      <label
                        key={day}
                        className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition
                        ${form.days.includes(day)
                          ? "bg-indigo-50 border-indigo-400"
                          : "hover:bg-gray-50"}`}
                      >
                        <input
                          type="checkbox"
                          value={day}
                          checked={form.days.includes(day)}
                          onChange={(e) => {
                            const value = e.target.value;

                            setForm(prev => {
                              let updatedDays;

                              if (e.target.checked) {
                                updatedDays = [...prev.days, value];
                              } else {
                                updatedDays = prev.days.filter(d => d !== value);
                              }

                              let updatedTimes = { ...prev.dayTimes };

                              if (!e.target.checked) {
                                delete updatedTimes[value];
                              }

                              return {
                                ...prev,
                                days: updatedDays,
                                dayTimes: updatedTimes
                              };
                            });
                          }}
                        />
                        {day}
                      </label>
                    ))}
                </div>
              </div>

              {/* Time Inputs */}
              {form.days.map(day => (
                <div key={day} className="flex items-center gap-3">
                  <label className="w-28 font-medium text-gray-600">
                    {day}
                  </label>
                  <input
                    type="time"
                    required
                    value={form.dayTimes[day] || ""}
                    onChange={(e) => {
                      setForm(prev => ({
                        ...prev,
                        dayTimes: {
                          ...prev.dayTimes,
                          [day]: e.target.value
                        }
                      }));
                    }}
                    className="border border-gray-300 px-3 py-2 rounded-lg flex-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              ))}

              {/* Tutor */}
              <select
                required
                onChange={(e) => setForm({ ...form, tutor: e.target.value })}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">Select Tutor</option>
                {tutors.map(t => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>

              {/* Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="px-5 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* BATCH STUDENTS LIST */}
{selectedCourse && selectedBatch && (
  <div className="mt-8 bg-white p-6 rounded-2xl shadow-md">

    <h2 className="text-xl font-bold mb-4 text-gray-800">
      Batch Details
    </h2>

    {/* Batch Name */}
    <p className="mb-2 text-gray-600">
      <strong>Batch:</strong>{" "}
      {batches.find(b => b._id === selectedBatch)?.batchName}
    </p>

    {/* Total Students */}
    <p className="mb-4 text-gray-600">
      <strong>Total Students:</strong> {batchStudents.length}
    </p>

    {/* Students Table */}
    <div className="overflow-x-auto">
      <table className="w-full border">
        <thead className="bg-indigo-600 text-white">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Phone</th>
          </tr>
        </thead>
        <tbody>
          {batchStudents.map(student => (
            <tr key={student._id} className="border-b">
              <td className="p-2">
                {student.visitorId?.name}
              </td>
              <td className="p-2">
                {student.visitorId?.email}
              </td>
              <td className="p-2">
                {student.visitorId?.phone}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  </div>
)}


    </div>
  );
}
