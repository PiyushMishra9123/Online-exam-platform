import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <nav className="bg-white shadow px-8 py-4 flex items-center justify-between">

        <h1 className="text-xl font-bold">
          Admin Panel
        </h1>

        <div className="flex items-center gap-4">

          <Link
            to="/dashboard"
            className="text-gray-600 hover:text-black"
          >
            User Dashboard
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>

      </nav>

      <main className="p-8">

        <h2 className="text-3xl font-bold">
          Welcome, Admin 👋
        </h2>

        <p className="text-gray-600 mt-2">
          Manage your Online Exam Platform
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold">
              Exams
            </h3>

            <p className="text-gray-500 mt-2">
              Create and manage exams
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold">
              Questions
            </h3>

            <p className="text-gray-500 mt-2">
              Manage exam questions
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold">
              Users
            </h3>

            <p className="text-gray-500 mt-2">
              Manage registered users
            </p>
          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;