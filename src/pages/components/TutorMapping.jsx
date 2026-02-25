import { useEffect, useState } from "react";
import axios from "axios";

export default function TutorMapping() {

  const token = localStorage.getItem("token");

  const [mappings, setMappings] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [batches, setBatches] = useState([]);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [selectedTutor, setSelectedTutor] = useState("");
  const [selectedBatches, setSelectedBatches] = useState([]);

  const [editTutor, setEditTutor] = useState("");
  const [editBatches, setEditBatches] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const mapRes = await axios.get("http://localhost:8000/tutormapping/findall");
    const tutorRes = await axios.get("http://localhost:8000/tutor/findall");
    const batchRes = await axios.get("http://localhost:8000/batch/allbatch");

    setMappings(mapRes.data);
    setTutors(tutorRes.data);
    setBatches(batchRes.data);
  };

  // 🔹 GROUP BY TUTOR
  const grouped = {};
  mappings.forEach(map => {
    const tutorId = map.tutor?._id;

    if (!grouped[tutorId]) {
      grouped[tutorId] = {
        tutor: map.tutor,
        batches: []
      };
    }

    grouped[tutorId].batches.push({
      name: map.batch?.batchName,
      id: map._id,
      batchId: map.batch?._id
    });
  });

  // ---------------- ADD ----------------
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!selectedTutor || selectedBatches.length === 0) {
      alert("Select tutor and at least one batch");
      return;
    }

    // 🔥 Multiple batch = multiple records
    for (let batchId of selectedBatches) {
      await axios.post(
        "http://localhost:8000/tutormapping/",
        {
          tutor: selectedTutor,
          batch: batchId
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    setShowAdd(false);
    setSelectedTutor("");
    setSelectedBatches([]);
    fetchAll();
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    await axios.delete(
      `http://localhost:8000/tutormapping/delete/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchAll();
  };

  // ---------------- EDIT ----------------
  const openEdit = (group) => {
    setEditTutor(group.tutor._id);
    setEditBatches(group.batches.map(b => b.batchId));
    setShowEdit(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    // 🔥 First delete old mappings
    const oldMappings = mappings.filter(
      m => m.tutor._id === editTutor
    );

    for (let map of oldMappings) {
      await axios.delete(
        `http://localhost:8000/tutormapping/delete/${map._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    // 🔥 Create new mappings
    for (let batchId of editBatches) {
      await axios.post(
        "http://localhost:8000/tutormapping/",
        {
          tutor: editTutor,
          batch: batchId
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    setShowEdit(false);
    fetchAll();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Tutor Batch Mapping
        </h1>

        <button
          onClick={() => setShowAdd(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          + Assign Batch
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-3 text-left">Tutor</th>
              <th className="p-3 text-left">Assigned Batches</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {Object.values(grouped).map(group => (
              <tr key={group.tutor._id} className="border-b">

                <td className="p-3 font-semibold">
                  {group.tutor.name}
                </td>

                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {group.batches.map(batch => (
                      <span
                        key={batch.id}
                        className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {batch.name}

                        <button
                          onClick={() => handleDelete(batch.id)}
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
                    onClick={() => openEdit(group)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD POPUP */}
      {showAdd && (
        <BatchPopup
          title="Assign Batch"
          tutors={tutors}
          batches={batches}
          selectedTutor={selectedTutor}
          setSelectedTutor={setSelectedTutor}
          selectedBatches={selectedBatches}
          setSelectedBatches={setSelectedBatches}
          onSubmit={handleAdd}
          onClose={() => setShowAdd(false)}
        />
      )}

      {/* EDIT POPUP */}
      {showEdit && (
        <BatchPopup
          title="Edit Mapping"
          tutors={tutors}
          batches={batches}
          selectedTutor={editTutor}
          setSelectedTutor={setEditTutor}
          selectedBatches={editBatches}
          setSelectedBatches={setEditBatches}
          onSubmit={handleEdit}
          onClose={() => setShowEdit(false)}
        />
      )}

    </div>
  );
}


// 🔹 COMMON POPUP
function BatchPopup({
  title,
  tutors,
  batches,
  selectedTutor,
  setSelectedTutor,
  selectedBatches,
  setSelectedBatches,
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
            value={selectedTutor}
            onChange={(e)=>setSelectedTutor(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Tutor</option>
            {tutors.map(t=>(
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>

          <div className="border p-3 rounded h-40 overflow-y-auto">
            {batches.map(batch=>(
              <label key={batch._id} className="flex gap-2">
                <input
                  type="checkbox"
                  value={batch._id}
                  checked={selectedBatches.includes(batch._id)}
                  onChange={(e)=>{
                    const value = e.target.value;
                    setSelectedBatches(prev =>
                      e.target.checked
                        ? [...prev, value]
                        : prev.filter(id=>id!==value)
                    );
                  }}
                />
                {batch.batchName}
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose}
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
