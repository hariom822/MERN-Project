import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentHeader() {
  const [user, setUser] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    axios
      .get(`http://localhost:8000/users/oneuser/${userId}`)
      .then((res) => setUser(res.data.user));
  }, []);

  return (
    <div className="h-16 bg-white shadow-md flex items-center justify-between px-6">
      <h1 className="font-bold text-lg text-gray-700">
        Welcome, {user?.name}
      </h1>
      <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center">
        {user?.name?.charAt(0)}
      </div>
    </div>
  );
}
