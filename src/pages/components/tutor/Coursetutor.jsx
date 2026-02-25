import axios from "axios";
import { useEffect, useState } from "react";
import { Pencil, Trash2, Power, RotateCcw } from "lucide-react";

export default function Course() {
  const [courses, setCourses] = useState([]);
  const [mapping, setMapping] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [skills, setSkills] = useState([]);
 const [aditcourse, setAditCourse] = useState({
  _id: "",
  coursename: "",
  duration: "",
  skill: "",
  startDate:"",
  endDate:"",
  fees: "",
  level: "beginner",
  description: "",
});

  const [showaditcourse, setShowAditCourse] = useState(false);


  const [showAddCourse, setShowAddCourse] = useState(false);

  const [form, setForm] = useState({
    coursename: "",
    duration: "",
    skill: "",
    fees: "",
    startDate:"",
    endDate:"",
    level: "beginner",
    description: "",
  });

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:8000/course/allcourse"
      );
      setCourses(res.data);
    } catch (err) {
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };
   const fetchmapping = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:8000/mapping/findall"
      );
      setMapping(res.data);
      console.log(res.data)
    } catch (err) {
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };
 const fetchSkills = async () => {
    try {
      const res = await axios.get(  
        "http://localhost:8000/skill/findall"
      );
      setSkills(res.data);
    }
      catch (err) {
        setError("Failed to load skills");
      }
  };
  useEffect(() => {
    fetchCourses();
    fetchSkills();
    fetchmapping();
  }, []);
console.log(courses)
  const handleAddCourse = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(
        "http://localhost:8000/course/",
        form
      );
      alert("Course added successfully ✅");
      setShowAddCourse(false);
      fetchCourses();
      setForm({
        coursename: "",
        duration: "",
        skill: "",
        startDate:"",
        endDate:"",
        fees: "",
        level: "beginner",
        description: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add course");
    }
  };
  const coursedelete = async(id) => {
    try {
        await axios.delete(
            `http://localhost:8000/course/deletecourse/${id}`
        );
        alert("Course deleted successfully ✅");
        fetchCourses();
    }   catch (err) {
        setError(err.response?.data?.message || "Failed to delete course");
    }
}
const dataAdit = async (e) => {
  e.preventDefault();
  console.log(aditcourse._id)
  const id=aditcourse._id
  try {
    await axios.put(
      `http://localhost:8000/course/updatecourse/${id}`,
      aditcourse
    );
    alert("Course updated successfully ✅");
    setShowAditCourse(false);
    fetchCourses();
  } catch (err) {
    setError(err.response?.data?.message || "Failed to update course");
  }
};

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Course List
        </h1>

        {/* <button
          onClick={() => setShowAddCourse(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Add Course
        </button> */}
      </div>

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full border-collapse">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Course Name</th>
              {/* <th className="px-4 py-3 text-left">Skill</th> */}
              <th className="px-4 py-3 text-left">Duration</th>
              <th className="px-4 py-3 text-left">Fees</th>
              <th className="px-4 py-3 text-left">Level</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Created</th>
              {/* <th className="px-4 py-3 text-left">Action</th> */}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6"
                >
                  Loading courses...
                </td>
              </tr>
            ) : courses.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6"
                >
                  No courses found
                </td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr
                  key={course._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium">
                    {course.coursename}
                  </td>
                  {/* <td className="px-4 py-3 font-medium">
                    {course.skill?.name || "N/A"}
                  </td> */}
                  <td className="px-4 py-3">
                    {course.duration}
                  </td>
                  <td className="px-4 py-3">
                    ₹{course.fees}
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {course.level}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                      {course.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                   {/* <td className="px-4 py-3">
                   <button
  onClick={() => {
    setAditCourse(course); 
    setShowAditCourse(true);
  }}
  className="text-indigo-600 hover:text-indigo-800"
>
  <Pencil size={18} />
</button>

                        <button
                        onClick={() =>coursedelete(course._id)}
                        className="text-red-600 hover:text-red-800 ml-4"
                        >
                            <Trash2 size={18} />
                        </button>
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
     {showaditcourse && (
  <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center z-50">
    
    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Edit Course
      </h2>

      <form onSubmit={dataAdit} className="space-y-4">

        <input
          placeholder="Course Name"
          value={aditcourse.coursename || ""}
          onChange={(e) =>
            setAditCourse({
              ...aditcourse,
              coursename: e.target.value,
            })
          }
          className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />

        <input
          placeholder="Duration"
          value={aditcourse.duration || ""}
          onChange={(e) =>
            setAditCourse({
              ...aditcourse,
              duration: e.target.value,
            })
          }
          className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="number"
          placeholder="Fees"
          value={aditcourse.fees || ""}
          onChange={(e) =>
            setAditCourse({
              ...aditcourse,
              fees: e.target.value,
            })
          }
          className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />

        <select
          value={aditcourse.level || "beginner"}
          onChange={(e) =>
            setAditCourse({
              ...aditcourse,
              level: e.target.value,
            })
          }
          className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <textarea
          placeholder="Description"
          value={aditcourse.description || ""}
          onChange={(e) =>
            setAditCourse({
              ...aditcourse,
              description: e.target.value,
            })
          }
          className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => setShowAditCourse(false)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Save
          </button>
        </div>

      </form>
    </div>
  </div>
)}

      {showAddCourse && (
        <div className="fixed inset-0  bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">
            <h2 className="text-xl font-bold mb-4">
              Add New Course
            </h2>
            <form
              onSubmit={handleAddCourse}
              className="space-y-4"
            >
              <input
                placeholder="Course Name"
                value={form.coursename}
                onChange={(e) =>
                  setForm({
                    ...form,
                    coursename: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded"
                required
              />

              <input
                placeholder="Duration (e.g. 3 Months)"
                value={form.duration}
                onChange={(e) =>
                  setForm({
                    ...form,
                    duration: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded"
                required
              />

              <input
                type="number"
                placeholder="Fees"
                value={form.fees}
                onChange={(e) =>
                  setForm({
                    ...form,
                    fees: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input type="date" value={form.startDate} onChange={(e)=>setForm({...form,startDate:e.target.value})}
              placeholder="Start Date"
               className="w-full border px-3 py-2 rounded" />

               <input type="date" value={form.endDate} onChange={(e)=>setForm({...form,endDate:e.target.value})}
              placeholder="End Date"
               className="w-full border px-3 py-2 rounded" />

              <select name="skill" id="skill" className="w-full border px-3 py-2 rounded
              " value={form.skill} onChange={(e)=>setForm({...form,skill:e.target.value})} required>
                <option value="">Select Skill</option>
                {skills.map((skill) => (
                  <option key={skill._id} value={skill._id}>
                    {skill.name}
                  </option>
                ))}
              </select>

              <select
                value={form.level}
                onChange={(e) =>
                  setForm({
                    ...form,
                    level: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">
                  Intermediate
                </option>
                <option value="advanced">Advanced</option>
              </select>

              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCourse(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
