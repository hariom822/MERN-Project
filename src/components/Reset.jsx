import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Reset = () => {
  const navigate = useNavigate();

  const [data, setData] = React.useState({
    email: "",
    oldpassword: "",
    newpassword: "",
    copassword: "",
  });

  const [error, setError] = React.useState({});
  const [serverError, setServerError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const datasumit = async (e) => {
    e.preventDefault();
    setServerError("");

    const arr = {};
    if (!data.email) arr.email = "Email is required";
    if (!data.oldpassword) arr.oldpassword = "Old password is required";
    if (!data.newpassword) arr.newpassword = "New password is required";
    if (!data.copassword) arr.copassword = "Confirm password is required";

    setError(arr);

    if (Object.keys(arr).length === 0) {
      if (data.newpassword !== data.copassword) {
        setServerError("New password and confirm password do not match");
        return;
      }

      try {
        setLoading(true);

        const res = await axios.post(
          "http://localhost:8000/users/reset",
          data
        );

        alert("Password reset successful ✅");
        setData({
          email: "",
          oldpassword: "",
          newpassword: "",
          copassword: "",
        });
        navigate("/login");
      } catch (err) {
        setServerError(
          err.response?.data?.message || "Password reset failed"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={datasumit}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Reset Password
        </h2>

        {serverError && (
          <p className="text-red-600 text-sm text-center">
            {serverError}
          </p>
        )}

        {/* EMAIL */}
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) =>
              setData({ ...data, email: e.target.value })
            }
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          {error.email && (
            <p className="text-red-500 text-xs mt-1">{error.email}</p>
          )}
        </div>

        {/* OLD PASSWORD */}
        <div>
          <label className="text-sm text-gray-600">Old Password</label>
          <input
            type="password"
            value={data.oldpassword}
            onChange={(e) =>
              setData({ ...data, oldpassword: e.target.value })
            }
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          {error.oldpassword && (
            <p className="text-red-500 text-xs mt-1">
              {error.oldpassword}
            </p>
          )}
        </div>

        {/* NEW PASSWORD */}
        <div>
          <label className="text-sm text-gray-600">New Password</label>
          <input
            type="password"
            value={data.newpassword}
            onChange={(e) =>
              setData({ ...data, newpassword: e.target.value })
            }
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          {error.newpassword && (
            <p className="text-red-500 text-xs mt-1">
              {error.newpassword}
            </p>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div>
          <label className="text-sm text-gray-600">
            Confirm Password
          </label>
          <input
            type="password"
            value={data.copassword}
            onChange={(e) =>
              setData({ ...data, copassword: e.target.value })
            }
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          {error.copassword && (
            <p className="text-red-500 text-xs mt-1">
              {error.copassword}
            </p>
          )}
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default Reset;
