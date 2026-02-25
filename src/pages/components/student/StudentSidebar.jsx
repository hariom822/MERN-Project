import { useNavigate, useLocation } from "react-router-dom";

export default function StudentSidebar({ closeSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/student" },
    { name: "My Course", path: "/student/course" },
    { name: "Timetable", path: "/student/timetable" },
    { name: "Full Information", path: "/student/profile" },
  ];

  const menuItemClass = (path) =>
    `w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
      location.pathname === path
        ? "bg-indigo-100 text-indigo-600 font-semibold"
        : "hover:bg-indigo-50 hover:text-indigo-600"
    }`;

  return (
    <div className="fixed z-50 flex max-h-screen overflow-x-auto overflow-y-auto">
      
      <div
        onClick={closeSidebar}
        className="absolute inset-0 bg-black bg-opacity-10"
      ></div>

      {/* Sidebar Panel */}
      <div className="relative w-64 h-full bg-white shadow-2xl p-6 flex flex-col z-50">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-indigo-600">
            Student Panel
          </h2>

          <button
            onClick={closeSidebar}
            className="text-gray-500 hover:text-red-500 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Menu Items */}
        <ul className="space-y-3 text-gray-700 flex-1">
          {menu.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => {
                  navigate(item.path);
                  closeSidebar();
                }}
                className={menuItemClass(item.path)}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="pt-6 border-t text-xs text-gray-400 text-center">
          © 2026 LMS Student Panel
        </div>

      </div>
    </div>
  );
}
