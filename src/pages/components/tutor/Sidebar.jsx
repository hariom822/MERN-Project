import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ closeSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItemClass = (path) =>
    `w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
      location.pathname === path
        ? "bg-indigo-100 text-indigo-600 font-semibold"
        : "hover:bg-indigo-50 hover:text-indigo-600"
    }`;

  return (
    <div className="fixed  z-50 flex max-h-screen overflow-x-auto overflow-y-auto">
      
      {/* Overlay */}
      <div
        onClick={closeSidebar}
        className="absolute inset-0 overflow-x-auto  bg-opacity-10"
      ></div>

      {/* Sidebar Panel */}
      <div className="relative w-64 h-full bg-white shadow-2xl p-6 flex flex-col z-50">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-indigo-600">
            Admin Panel
          </h2>

          {/* Close Icon */}
          <button
            onClick={() => closeSidebar()}
            className="text-gray-500 hover:text-red-500 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Menu Items */}
        <ul className="space-y-3 text-gray-700 flex-1">

          <li>
            <button
              onClick={() => {
                navigate("/");
                closeSidebar();
              }}
              className={menuItemClass("/")}
            >
              Dashboard
            </button>
          </li>

          <li>
            <button
              onClick={() => {
                navigate("/tutor/course");
                closeSidebar();
              }}
              className={menuItemClass("/tutor/course")}
            >
              Course
            </button>
          </li>

          <li>
            <button
              onClick={() => {
                navigate("/tutor/student");
                closeSidebar();
              }}
              className={menuItemClass("/tutor/student")}
            >
              Student
            </button>
          </li>
           <li>
            <button
              onClick={() => {
                navigate("/tutor/all");
                closeSidebar();
              }}
              className={menuItemClass("/tutors/all")}
            >
              tutors
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                navigate("/tutor/batch");
                closeSidebar();
              }}
              className={menuItemClass("/tutor/batch")}
            >
              Batch
            </button>
          </li>
         
          
          <li>
            <button
              onClick={() => {
                navigate("/tutor/timetable");
                closeSidebar();
              }}
              className={menuItemClass("/tutor/timetable")}
            >
              Timetable
            </button>
            </li>
            

          
        </ul>

        <div className="pt-6 border-t text-xs text-gray-400 text-center">
          © 2026 LMS Panel
        </div>

      </div>
    </div>
  );
}
