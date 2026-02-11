import axios from "axios";
import { tr } from "framer-motion/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function User({ setOpenUser }) 
 {
  const navigate = useNavigate();
 const [userdata, setUserdata] = useState(null);
  const logout = () => {
  localStorage.removeItem("token");
  setOpenUser(false);  
  navigate("/login");
};

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
    loginuser();
  }, []);

  const id=localStorage.getItem("userId")
  const loginuser=async()=>{
    try {
      const token = localStorage.getItem("token");
    const usrdata=await axios.get(`http://localhost:8000/users/oneuser/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
      
    })
    setUserdata(usrdata.data)
    console.log(usrdata.data)
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
    
  }

  const profiledata=()=>{
    navigate("/profile")
  }
  return (
    <div className="absolute bg-amber-100 right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border">
      <div className="px-4 py-3 border-b">
        <p className="text-sm font-semibold"> Name {userdata?.user?.name} </p>
        <p className="text-xs text-gray-500">Email {userdata?.user?.email}</p>
      </div>
      <ul className="text-sm">
        <li
  onClick={() => {
    setOpenUser(false);  
    navigate("/profile");
  }}
  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
>
  Profile
</li>

        <li
          onClick={logout}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
        >
          Logout
        </li>
      </ul>
    </div>
  );
}
