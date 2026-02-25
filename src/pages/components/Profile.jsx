import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [userdata, setUserdata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aditpopup, setAditPopup] = useState(false);
  const [updatedata, setUpdateData] = useState({
    name:userdata?.name || "",
    email: userdata?.email || "",
    phone: userdata?.phone || "",
    theme: userdata?.theme || "light",
  });
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const id = localStorage.getItem("userId");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUser();
  }, []);
   const handleResetPassword = () => {
    navigate("/reset");
  };
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:8000/users/oneuser/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserdata(res.data.user);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-sm text-gray-500">Loading profile...</div>
    );
  }

  const profileadit = async() => {
        try {
        const token = localStorage.getItem("token");
            await axios.post(
                `http://localhost:8000/users/update/${id}`,
                updatedata,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Profile updated successfully ✅");
            setAditPopup(false);
            fetchUser();
        }
        catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile");
        }
  };
return (
  <div className="min-h-screen flex items-center justify-center bg-amber-50 bg-gray-100 px-4">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border">

      {/* HEADER */}
      <div className="flex flex-col items-center py-6 border-b">
        <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
          {userdata?.name?.charAt(0).toUpperCase()}
        </div>

        <h2 className="mt-4 text-lg font-semibold text-gray-800">
          {userdata?.name}
        </h2>

        <p className="text-sm text-gray-500">{userdata?.email}</p>

        <span className="mt-2 px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-600 capitalize">
          {userdata?.roll || "user"}
        </span>
      </div>

      {/* DETAILS */}
      <div className="px-6 py-4 space-y-3 text-sm text-gray-700">
        <div className="flex justify-between">
          <span className="font-medium">Phone</span>
          <span>{userdata?.phone || "N/A"}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">Theme</span>
          <span className="capitalize">{userdata?.theme || "light"}</span>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="px-6 py-4 border-t space-y-3">
        <button
          onClick={() => setAditPopup(true)}
          className="w-full py-2 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition"
        >
          ✏️ Update Profile
        </button>

        <button
        onClick={handleResetPassword}
          className="w-full py-2 rounded-lg border border-yellow-500 text-yellow-600 hover:bg-yellow-50 transition"
        >
          🔐 Reset Password
        </button>

        <button
          onClick={logout}
          className="w-full py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
        >
          🚪 Logout
        </button>
         <button
          onClick={() => navigate("/")}
          className="w-full py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-800 transition"
        >
            🏠 Back to Dashboard
        </button>
      </div>
      {aditpopup && (
        <div className="absolute inset-0  bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Update Profile</h3>
            <form>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={updatedata.name}
                  onChange={(e) => setUpdateData({...updatedata, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={updatedata.email}
                  onChange={(e) => setUpdateData({...updatedata, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  value={updatedata.phone}
                  onChange={(e) => setUpdateData({...updatedata, phone: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Theme</label>
                <select
                  value={updatedata.theme}
                  onChange={(e) => setUpdateData({...updatedata, theme: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="">Select Theme</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              <button
                type="button"
                onClick={profileadit}
                className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition mb-2"
              >
                Save Changes

              </button>
              <button
                type="button"
                onClick={() => setAditPopup(false)}
                className="w-full py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition mr-2"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  </div>
);
}