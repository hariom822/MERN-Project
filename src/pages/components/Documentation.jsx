// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Download } from "lucide-react";

// export default function Documentation() {

//   const token = localStorage.getItem("token");

//   const [activeTab, setActiveTab] = useState("students");

//   const [students, setStudents] = useState([]);
//   const [tutors, setTutors] = useState([]);
//   const [employees, setEmployees] = useState([]);

//   const [selectedIds, setSelectedIds] = useState([]);

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   const fetchAllData = async () => {
//     try {
//       const [stu, tut, emp] = await Promise.all([
//         axios.get("http://localhost:8000/student/findall"),
//         axios.get("http://localhost:8000/tutor/findall"),
//         axios.get("http://localhost:8000/employe/allemployee")
//       ]);

//       setStudents(stu.data);
//       console.log(stu.data)
//       setTutors(tut.data);
//       setEmployees(emp.data);

//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const getCurrentData = () => {
//     if (activeTab === "students") return students;
//     if (activeTab === "tutors") return tutors;
//     if (activeTab === "employees") return employees;
//   };

//   const toggleSelect = (id) => {
//     if (selectedIds.includes(id)) {
//       setSelectedIds(selectedIds.filter(item => item !== id));
//     } else {
//       setSelectedIds([...selectedIds, id]);
//     }
//   };

//   const convertToCSV = (data) => {
//     if (!data.length) return "";

//     const headers = Object.keys(data[0]);
//     const rows = data.map(row =>
//       headers.map(field => `"${row[field] ?? ""}"`).join(",")
//     );

//     return [headers.join(","), ...rows].join("\n");
//   };

//   const downloadFile = (data, filename) => {
//     const csv = convertToCSV(data);
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = window.URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", filename);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const downloadSelected = () => {
//     const currentData = getCurrentData();
//     const filtered = currentData.filter(item =>
//       selectedIds.includes(item._id)
//     );

//     if (!filtered.length) {
//       alert("Select at least one record");
//       return;
//     }

//     downloadFile(filtered, `${activeTab}_selected.csv`);
//   };

//   const downloadAllData = () => {
//     const allData = [
//       ...students.map(s => ({ type: "Student", ...s })),
//       ...tutors.map(t => ({ type: "Tutor", ...t })),
//       ...employees.map(e => ({ type: "Employee", ...e }))
//     ];

//     downloadFile(allData, "all_data.csv");
//   };

//   const currentData = getCurrentData();

//   return (
//     <div className="p-8 bg-gray-100 min-h-screen">

//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">
//           Documentation Export
//         </h1>

//         <button
//           onClick={downloadAllData}
//           className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
//         >
//           <Download size={18} />
//           Download All Data
//         </button>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-4 mb-6">
//         {["students", "tutors", "employees"].map(tab => (
//           <button
//             key={tab}
//             onClick={() => {
//               setActiveTab(tab);
//               setSelectedIds([]);
//             }}
//             className={`px-4 py-2 rounded-lg capitalize ${
//               activeTab === tab
//                 ? "bg-indigo-600 text-white"
//                 : "bg-white border"
//             }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-xl shadow-xl overflow-x-auto">
//         <table className="w-full">
//           <thead className="bg-indigo-600 text-white">
//             <tr>
//               <th className="p-3">Select</th>
//               <th className="p-3">Name</th>
//               <th className="p-3">Email</th>
//               <th className="p-3">Phone</th>
//             </tr>
//           </thead>

//        <tbody>
//   {activeTab === "students"
//     ? currentData.map(item => (
//         <tr key={item._id} className="border-b hover:bg-gray-50">
//           <td className="p-3 text-center">
//             <input
//               type="checkbox"
//               checked={selectedIds.includes(item.visitorId?._id)}
//               onChange={() => toggleSelect(item._id)}
//             />
//           </td>

//           <td className="p-3">{item.visitorId?.name}</td>
//           <td className="p-3">{item.visitorId?.email}</td>
//           <td className="p-3">{item.visitorId?.phone}</td>
//         </tr>
//       ))
//     : currentData.map(item => (
//         <tr key={item._id} className="border-b hover:bg-gray-50">
//           <td className="p-3 text-center">
//             <input
//               type="checkbox"
//               checked={selectedIds.includes(item._id)}
//               onChange={() => toggleSelect(item._id)}
//             />
//           </td>

//           <td className="p-3">{item.name}</td>
//           <td className="p-3">{item.email}</td>
//           <td className="p-3">{item.phone}</td>
//         </tr>
//       ))}
// </tbody>

//         </table>
//       </div>

//       {/* Selected Download */}
//       <div className="mt-6">
//         <button
//           onClick={downloadSelected}
//           className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
//         >
//           Download Selected
//         </button>
//       </div>

//     </div>
//   );
// }
import { useEffect, useState } from "react";
import axios from "axios";

export default function Documentation() {

  const [students, setStudents] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [activeTab, setActiveTab] = useState("student");
  const [selectedIds, setSelectedIds] = useState([]);

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const studentRes = await axios.get("http://localhost:8000/student/findall");
    const tutorRes = await axios.get("http://localhost:8000/tutor/findall");
    const employeeRes = await axios.get("http://localhost:8000/employe/allemployee");

    setStudents(studentRes.data);
    console.log(studentRes.data)
    setTutors(tutorRes.data);
    setEmployees(employeeRes.data);
  };

  // 🔹 Get Current Tab Data (Filtered + Sorted)
  const getCurrentData = () => {
    let data =
      activeTab === "student"
        ? students
        : activeTab === "tutor"
        ? tutors
        : employees;

    // 🔎 SEARCH
    if (search) {
      data = data.filter(item => {
        const name =
          activeTab === "student"
            ? item.visitorId?.name
            : item.name;

        const email =
          activeTab === "student"
            ? item.visitorId?.email
            : item.email;

        return (
          name?.toLowerCase().includes(search.toLowerCase()) ||
          email?.toLowerCase().includes(search.toLowerCase())
        );
      });
    }

    // 📅 DATE FILTER
    if (fromDate && toDate) {
      data = data.filter(item => {
        const itemDate =
          // activeTab === "student"
             new Date(item.date)
            // : new Date(item.createdAt);
       console.log(item.date)
        return (
          itemDate >= new Date(fromDate) &&
          itemDate <= new Date(toDate)
        );
      });
    }

    // 🔃 SORTING
    data.sort((a, b) => {
      const aValue =
        activeTab === "student"
          ? a.visitorId?.[sortField]
          : a[sortField];

      const bValue =
        activeTab === "student"
          ? b.visitorId?.[sortField]
          : b[sortField];

      return aValue?.toString().localeCompare(bValue?.toString());
    });

    return data;
  };

  const currentData = getCurrentData();

  // 🔹 Select Toggle
  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const downloadCSV = (data) => {
    if (!data.length) return alert("No Data Found");

    const formatted = data.map(item => {
      if (activeTab === "student") {
        return {
          Name: item.visitorId?.name,
          Email: item.visitorId?.email,
          Phone: item.visitorId?.phone,
          Date: item.date
        };
      } else {
        return {
          Name: item.name,
          Email: item.email,
          Phone: item.phone,
          Date: item.createdAt
        };
      }
    });

    const headers = Object.keys(formatted[0]).join(",");
    const rows = formatted.map(obj =>
      Object.values(obj)
        .map(val => `"${val || ""}"`)
        .join(",")
    );

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `${activeTab}-data.csv`;
    link.click();
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Documentation & Data Export
      </h1>
      <div className="flex gap-4 mb-6">
        {["student", "tutor", "employee"].map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSelectedIds([]);
            }}
            className={`px-5 py-2 rounded-lg capitalize transition ${
              activeTab === tab
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 🔎 Search + Sort + Date */}
      <div className="bg-white p-5 rounded-xl shadow-md mb-6 flex flex-wrap gap-4 items-center justify-between">

        <input
          type="text"
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        />

        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
        </select>

        <div className="flex gap-3 items-center">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          />
          <span>-</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() =>
              downloadCSV(
                currentData.filter(item =>
                  selectedIds.includes(item._id)
                )
              )
            }
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Download Selected
          </button>

          <button
            onClick={() => downloadCSV(currentData)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            Download All
          </button>
        </div>
      </div>

      {/* 📊 Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-3 text-center">Select</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map(item => {

              const name =
                activeTab === "student"
                  ? item.visitorId?.name
                  : item.name;

              const email =
                activeTab === "student"
                  ? item.visitorId?.email
                  : item.email;

              const phone =
                activeTab === "student"
                  ? item.visitorId?.phone
                  : item.phone;

              return (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item._id)}
                      onChange={() => toggleSelect(item._id)}
                    />
                  </td>

                  <td className="p-3">{name}</td>
                  <td className="p-3">{email}</td>
                  <td className="p-3">{phone}</td>
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>

    </div>
  );
}
