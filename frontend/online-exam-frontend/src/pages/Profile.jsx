import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function Profile() {
  const { user, token, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "",});
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
  setPasswordData({
    ...passwordData,
    [e.target.name]: e.target.value,
  });
};

  const handlePasswordSubmit = async (e) => {
  e.preventDefault();

  setPasswordMessage("");
  setPasswordError("");
  setPasswordLoading(true);

  try {
    const response = await api.put(
      "/auth/change-password",
      passwordData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setPasswordMessage(response.data.message);

    setPasswordData({
      currentPassword: "",
      newPassword: "",
    });

  } catch (error) {
    setPasswordError(
      error.response?.data?.message ||
      "Password change failed"
    );
  } finally {
    setPasswordLoading(false);
  }
};
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await api.put(
        "/auth/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
      updateUser(response.data.user);

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Profile update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <nav className="bg-white shadow px-8 py-4 flex items-center justify-between">
        <Link
          to="/dashboard"
          className="text-xl font-bold"
        >
          Online Exam Platform
        </Link>

        <Link
          to="/dashboard"
          className="text-gray-600 hover:text-black"
        >
          Dashboard
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto p-8">

        <div className="bg-white rounded-xl shadow p-8">

          <h1 className="text-3xl font-bold mb-6">
            My Profile
          </h1>

          {message && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-5">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>
              <label className="block mb-1 font-medium">
                Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Role
              </p>

              <span className="inline-block mt-1 px-3 py-1 bg-gray-200 rounded-full text-sm font-medium">
                {user?.role}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-6 py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>

          </form>
          <div className="mt-10 pt-8 border-t">

  <h2 className="text-2xl font-bold mb-5">
    Change Password
  </h2>

  {passwordMessage && (
    <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-5">
      {passwordMessage}
    </div>
  )}

  {passwordError && (
    <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-5">
      {passwordError}
    </div>
  )}

  <form
    onSubmit={handlePasswordSubmit}
    className="space-y-5"
  >

    <div>
      <label className="block mb-1 font-medium">
        Current Password
      </label>

      <input
        type="password"
        name="currentPassword"
        value={passwordData.currentPassword}
        onChange={handlePasswordChange}
        placeholder="Enter current password"
        className="w-full border rounded-lg px-4 py-2"
        required
      />
    </div>

    <div>
      <label className="block mb-1 font-medium">
        New Password
      </label>

      <input
        type="password"
        name="newPassword"
        value={passwordData.newPassword}
        onChange={handlePasswordChange}
        placeholder="Enter new password"
        className="w-full border rounded-lg px-4 py-2"
        minLength={6}
        required
      />
    </div>

    <button
      type="submit"
      disabled={passwordLoading}
      className="bg-black text-white px-6 py-2 rounded-lg disabled:opacity-50"
    >
      {passwordLoading
        ? "Changing..."
        : "Change Password"}
    </button>

  </form>

</div>

        </div>

      </main>

    </div>
  );
}

export default Profile;