import axios from "axios";
import { useEffect, useState } from "react";
import { Pencil, Trash2, Power, RotateCcw } from "lucide-react";

export default function Skill() {
  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");

  const [form, setForm] = useState({
    name: "",
    duration: "",
    price: "",
    mode: "online",
  });

  const [editSkill, setEditSkill] = useState(null);

  const token = localStorage.getItem("token");

  const fetchSkills = async () => {
    try {
      const res = await axios.get("http://localhost:8000/skill/findall", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSkills(res.data);
      setFilteredSkills(res.data);
    } catch (err) {
      setError("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);
  useEffect(() => {
    let data = [...skills];

    if (search) {
      data = data.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortBy === "priceLow") {
      data.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "priceHigh") {
      data.sort((a, b) => b.price - a.price);
    }

    setFilteredSkills(data);
  }, [search, sortBy, skills]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/skill/", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowAdd(false);
      setForm({ name: "", duration: "", price: "", mode: "online" });
      fetchSkills();
    } catch (err) {
      setError("Add failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this skill?")) return;

    try {
      await axios.delete(`http://localhost:8000/skill/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSkills();
    } catch (err) {
      setError("Delete failed");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:8000/skill/update/${editSkill._id}`,
        editSkill,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowEdit(false);
      fetchSkills();
    } catch (err) {
      setError("Update failed");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Skill Management</h1>

        <button
          onClick={() => setShowAdd(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          + Add Skill
        </button>
      </div>

      {/* SEARCH + SORT */}
      <div className="flex gap-4 mb-4">
        <input
          placeholder="Search skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-1/3"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Sort By</option>
          <option value="priceLow">Price Low → High</option>
          <option value="priceHigh">Price High → Low</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Duration</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Mode</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : (
              filteredSkills.map((skill) => (
                <tr key={skill._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{skill.name}</td>
                  <td className="px-4 py-3">{skill.duration}</td>
                  <td className="px-4 py-3">₹{skill.price}</td>
                  <td className="px-4 py-3 capitalize">{skill.mode}</td>
                  <td className="px-4 py-3 space-x-3">
                    <button
                      onClick={() => {
                        setEditSkill(skill);
                        setShowEdit(true);
                      }}
                      className="text-indigo-600"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(skill._id)}
                      className="text-red-600"
                    >
                       <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <Modal title="Add Skill" close={() => setShowAdd(false)}>
          <form onSubmit={handleAdd} className="space-y-4">
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />
            <input
              placeholder="Duration"
              value={form.duration}
              onChange={(e) =>
                setForm({ ...form, duration: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />
            <select
              value={form.mode}
              onChange={(e) =>
                setForm({ ...form, mode: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>

            <button className="bg-indigo-600 text-white px-4 py-2 rounded w-full">
              Save
            </button>
          </form>
        </Modal>
      )}

      {showEdit && editSkill && (
        <Modal title="Edit Skill" close={() => setShowEdit(false)}>
          <form onSubmit={handleEdit} className="space-y-4">
            <input
              value={editSkill.name}
              onChange={(e) =>
                setEditSkill({
                  ...editSkill,
                  name: e.target.value,
                })
              }
              className="w-full border px-3 py-2 rounded"
            />
            <input
              value={editSkill.duration}
              onChange={(e) =>
                setEditSkill({
                  ...editSkill,
                  duration: e.target.value,
                })
              }
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="number"
              value={editSkill.price}
              onChange={(e) =>
                setEditSkill({
                  ...editSkill,
                  price: e.target.value,
                })
              }
              className="w-full border px-3 py-2 rounded"
            />
            <button className="bg-indigo-600 text-white px-4 py-2 rounded w-full">
              Update
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, title, close }) {
  return (
    <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
        <button
          onClick={close}
          className="mt-4 w-full bg-gray-300 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
