import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentHeader from "./Studentheader";
import StudentSidebar from "./StudentSidebar";

export default function StudentLayout({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "student") {
      navigate("/");
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <StudentSidebar />
      <div className="flex-1 flex flex-col">
        <StudentHeader />
        <div className="p-6 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
