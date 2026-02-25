import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import User from "./User";
import StudentSidebar from "./student/StudentSidebar";
import HrSidebar from "./employee/HrSidebar"
import Sidebartutor from "./tutor/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [userdata, setUserdata] = useState(null);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const id = localStorage.getItem("userId");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }
    fetchUser();
  }, []);

  const fetchUser = async () => {
     try {
      const token = localStorage.getItem("token");
    const res=await axios.get(`http://localhost:8000/users/oneuser/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    })
      setUserdata(res.data.user);
    } catch (error) {
       if (error.response?.data?.message === "Token expired") {
          alert("Token expired, please login again");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
       }
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };
 const role=localStorage.getItem("role")
  return (
    <>
      <header className="w-full h-14 bg-white shadow-md flex items-center justify-between px-6">

        {/* LEFT MENU BUTTON */}
        <div className="relative flex items-center gap-3 ">
        <button
          onClick={() => setOpenSidebar(true)}
          className="text-2xl text-gray-700 hover:text-indigo-600 transition"
        >
          ☰
        </button>
          <h2 className="text-2xl font-bold text-gray-800 pl-4  ">{role}</h2>
        </div>

        <div className="relative flex items-center gap-3">

          {!loading && userdata && (
            <span className="text-sm text-gray-600 hidden sm:block">
              Welcome, {userdata.name}
            </span>
          )}

         <div className="relative">
           <div
            onClick={() => setOpenUser(!openUser)}
            className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center cursor-pointer font-semibold"
          >
            {userdata?.name?.charAt(0).toUpperCase()}
          </div>
          {openUser && <User setOpenUser={setOpenUser} />}
        </div>
        </div>
      </header>
{openSidebar && (role==="admin"? <Sidebar closeSidebar={() => setOpenSidebar(false)} />:
  (role==="student"?  <StudentSidebar closeSidebar={() => setOpenSidebar(false)}/>:
  (role==="tutor"?  <Sidebartutor closeSidebar={() => setOpenSidebar(false)}/> :
    <HrSidebar closeSidebar={() => setOpenSidebar(false)}/>) ))
}
    </>
  );
}
