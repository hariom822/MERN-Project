import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Power, RotateCcw,RefreshCcw } from "lucide-react";
export default function Mapping() {

  const token = localStorage.getItem("token");

  const [mappings, setMappings] = useState([]);
  const [courses, setCourses] = useState([]);
  const [skills, setSkills] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);

  const [editCourse, setEditCourse] = useState("");
  const [editSkills, setEditSkills] = useState([]);
  const [editCourseId, setEditCourseId] = useState(null);

  useEffect(() => {
    fetchMappings();
    fetchCourses();
    fetchSkills();
  }, []);

  const fetchMappings = async () => {
    const res = await axios.get("http://localhost:8000/mapping/findall");
    setMappings(res.data);
  };

  const fetchCourses = async () => {
    const res = await axios.get("http://localhost:8000/course/allcourse");
    setCourses(res.data);
  };

  const fetchSkills = async () => {
    const res = await axios.get("http://localhost:8000/skill/findall");
    setSkills(res.data);
  };

  // 🔹 GROUP BY COURSE
  const grouped = {};
  mappings.forEach(map => {
    const courseId = map.course?._id;

    if (!grouped[courseId]) {
      grouped[courseId] = {
        course: map.course,
        skills: []
      };
    }

    grouped[courseId].skills.push({
      name: map.skill?.name,
      id: map._id,
      skillId: map.skill?._id
    });
  });

  // ---------------- ADD ----------------
  const handleAdd = async (e) => {
    e.preventDefault();

    for (let skillId of selectedSkills) {
      await axios.post(
        "http://localhost:8000/mapping/",
        {
          name: "Mapping",
          course: selectedCourse,
          skill: skillId
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    setShowPopup(false);
    setSelectedCourse("");
    setSelectedSkills([]);
    fetchMappings();
  };

  // ---------------- DELETE SINGLE SKILL ----------------
  const handleDelete = async (id) => {
    await axios.delete(
      `http://localhost:8000/mapping/delete/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchMappings();
  };

  // ---------------- EDIT ----------------
  const openEditPopup = (courseId, courseSkills) => {
    setEditCourse(courseId);
    setEditCourseId(courseId);
    setEditSkills(courseSkills.map(s => s.skillId));
    setShowEdit(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    // 🔥 Delete old mappings for that course
    const oldMappings = mappings.filter(
      m => m.course?._id === editCourseId
    );

    for (let map of oldMappings) {
      await axios.delete(
        `http://localhost:8000/mapping/delete/${map._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    // 🔥 Create new selected skills
    for (let skillId of editSkills) {
      await axios.post(
        "http://localhost:8000/mapping/",
        {
          name: "Mapping",
          course: editCourse,
          skill: skillId
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    setShowEdit(false);
    fetchMappings();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Course Skill Mapping</h1>

        <button
          onClick={() => setShowPopup(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          + Add Mapping
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-3 text-left">Course</th>
              <th className="p-3 text-left">Skills</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {Object.values(grouped).map(group => (
              <tr key={group.course?._id} className="border-b hover:bg-gray-50">

                <td className="p-3 font-semibold">
                  {group.course?.coursename}
                </td>

                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map(skill => (
                      <span
                        key={skill.id}
                        className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {skill.name}
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="text-red-500 text-xs"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </td>

                <td className="p-3">
                  <button
                    onClick={() =>
                      openEditPopup(
                        group.course?._id,
                        group.skills
                      )
                    }
                    className="text-blue-600"
                  >
                     <Pencil size={18} />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* ADD POPUP */}
      {showPopup && (
        <Popup
          title="Add Mapping"
          course={selectedCourse}
          setCourse={setSelectedCourse}
          selectedSkills={selectedSkills}
          setSelectedSkills={setSelectedSkills}
          courses={courses}
          skills={skills}
          onSubmit={handleAdd}
          onClose={() => setShowPopup(false)}
        />
      )}

      {/* EDIT POPUP */}
      {showEdit && (
        <Popup
          title="Edit Mapping"
          course={editCourse}
          setCourse={setEditCourse}
          selectedSkills={editSkills}
          setSelectedSkills={setEditSkills}
          courses={courses}
          skills={skills}
          onSubmit={handleEdit}
          onClose={() => setShowEdit(false)}
        />
      )}

    </div>
  );
}


// 🔹 COMMON POPUP COMPONENT
function Popup({
  title,
  course,
  setCourse,
  selectedSkills,
  setSelectedSkills,
  courses,
  skills,
  onSubmit,
  onClose
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white w-full max-w-md p-6 rounded-xl">

        <h2 className="text-xl font-bold mb-4">{title}</h2>

        <form onSubmit={onSubmit} className="space-y-4">

          <select
            required
            value={course}
            onChange={(e)=>setCourse(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Course</option>
            {courses.map(c=>(
              <option key={c._id} value={c._id}>
                {c.coursename}
              </option>
            ))}
          </select>

          <div className="border p-3 rounded h-40 overflow-y-auto">
            {skills.map(skill=>(
              <label key={skill._id} className="flex gap-2">
                <input
                  type="checkbox"
                  value={skill._id}
                  checked={selectedSkills.includes(skill._id)}
                  onChange={(e)=>{
                    const value = e.target.value;
                    setSelectedSkills(prev =>
                      e.target.checked
                        ? [...prev, value]
                        : prev.filter(id=>id!==value)
                    );
                  }}
                />
                {skill.name}
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <button type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>

            <button type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded">
              Save
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
