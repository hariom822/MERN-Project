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

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");

  const [showPopup, setShowPopup] = useState(false);

  const [form, setForm] = useState({
   days: [],
    Data: "",
    time: "",
    tutor: ""
  });


  useEffect(() => {
    fetchCourses();
    fetchTutors();
    fetchTimetable();
  }, []);

  useEffect(() => {
    if (selectedCourse) fetchBatches();
  }, [selectedCourse]);

  const fetchCourses = async () => {
    const res = await axios.get("http://localhost:8000/course/allcourse");
    setCourses(res.data);
  };

  const fetchBatches = async () => {
    const res = await axios.get("http://localhost:8000/batch/allbatch");
    setBatches(res.data); //.filter(b => b.course?._id === selectedCourse)
  };

  const fetchTutors = async () => {
    const res = await axios.get(
      "http://localhost:8000/tutor/findall",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTutors(res.data);
  };

  const fetchTimetable = async () => {
    const res = await axios.get(
      "http://localhost:8000/timetable/findall"
    );

    const formatted = res.data
      .filter(t => !t.isdeleted)
      .map(t => {

        const start = moment(t.Data)
          .set({
            hour: moment(t.time, "HH:mm").hour(),
            minute: moment(t.time, "HH:mm").minute()
          });

        const end = moment(start).add(1, "hour");

        return {
          id: t._id,
          title: `${t.course?.coursename} (${t.batch?.batchName})`,
          start: start.toDate(),
          end: end.toDate()
        };
      });

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
    await fetchTimetable();
  };


  const deleteTimetable = async (id) => {
    await axios.put(
      `http://localhost:8000/timetable/delete/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchTimetable();
  };


  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">
        Timetable
      </h1>

      {/* COURSE + BATCH SELECT */}
      <div className="flex gap-4 mb-6">

        <select
          onChange={(e)=>setSelectedCourse(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Select Course</option>
          {courses.map(c=>(
            <option key={c._id} value={c._id}>
              {c.coursename}
            </option>
          ))}
        </select>

        {selectedCourse && (
          <select
            onChange={(e)=>setSelectedBatch(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">Select Batch</option>
            {batches.map(b=>(
              <option key={b._id} value={b._id}>
                {b.batchName}
              </option>
            ))}
          </select>
        )}

        {selectedCourse && selectedBatch && (
          <button
            onClick={()=>setShowPopup(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            + Add Timetable
          </button>
        )}
      </div>

      {/* CALENDAR */}
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <Calendar
          key={events.length}
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 650 }}
          views={["month","week","day"]}
          popup
        />
      </div>

      {/* ADD POPUP */}
      {showPopup && (
        <div className="fixed inset-0  bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl">

            <h2 className="text-xl font-bold mb-4">
              Add Timetable
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

                <div className="grid grid-cols-3 gap-2 mt-2">
  {["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
  .map(day => (
    <label key={day} className="flex items-center gap-2">
      <input
        type="checkbox"
        value={day}
        checked={form.days.includes(day)}
        onChange={(e) => {
          const value = e.target.value;

          setForm(prev => ({
            ...prev,
            days: e.target.checked
              ? [...prev.days, value]
              : prev.days.filter(d => d !== value)
          }));
        }}
      />
      {day}
    </label>
  ))}
</div>


              {/* <input
                type="date"
                required
                onChange={(e)=>setForm({...form,Data:e.target.value})}
                className="w-full border px-3 py-2 rounded"
              /> */}

              <input
                type="time"
                required
                onChange={(e)=>setForm({...form,time:e.target.value})}
                className="w-full border px-3 py-2 rounded"
              />

              <select
                required
                onChange={(e)=>setForm({...form,tutor:e.target.value})}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Tutor</option>
                {tutors.map(t=>(
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={()=>setShowPopup(false)}
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
