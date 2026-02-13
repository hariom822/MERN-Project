import { useEffect, useState } from "react";
import axios from "axios";

export default function Mapping() {

  const token = localStorage.getItem("token");

  const [mappings, setMappings] = useState([]);
  const [courses, setCourses] = useState([]);
  const [skills, setSkills] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);

  const [editData, setEditData] = useState(null);

  // ---------------- FETCH ----------------

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

  // ---------------- ADD ----------------

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!selectedCourse || selectedSkills.length === 0) {
      alert("Select course and at least one skill");
      return;
    }

    try {

      // 🔥 Multiple skill = multiple records
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

    } catch (error) {
      console.log(error.response?.data);
    }
  };

  // ---------------- EDIT ----------------

  const handleEdit = async (e) => {
    e.preventDefault();

    await axios.put(
      `http://localhost:8000/mapping/update/${editData._id}`,
      editData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setShowEdit(false);
    fetchMappings();
  };

  // ---------------- DELETE ----------------

  const handleDelete = async (id) => {
    await axios.delete(
      `http://localhost:8000/mapping/delete/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchMappings();
  };

  // ---------------- UI ----------------

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
              <th className="p-3 text-left">Skill</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {mappings.map(map => (
              <tr key={map._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{map.course?.coursename}</td>
                <td className="p-3">{map.skill?.name}</td>
                <td className="p-3">
                  {new Date(map.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3 space-x-3">
                  <button
                    onClick={() => {
                      setEditData(map);
                      setShowEdit(true);
                    }}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(map._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center">
          <div className="bg-white w-full max-w-md p-6 rounded-xl">

            <h2 className="text-xl font-bold mb-4">Add Mapping</h2>

            <form onSubmit={handleAdd} className="space-y-4">

              {/* Course Single */}
              <select
                required
                value={selectedCourse}
                onChange={(e)=>setSelectedCourse(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Course</option>
                {courses.map(c=>(
                  <option key={c._id} value={c._id}>
                    {c.coursename}
                  </option>
                ))}
              </select>

              {/* Skill Multiple */}
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
