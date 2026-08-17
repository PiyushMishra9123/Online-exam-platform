import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
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
          Online Exam Platform
        </h1>

        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg">
          Logout
        </button>
      </nav>

      <main className="p-8">

        <h2 className="text-3xl font-bold">
          Welcome, {user?.name || "User"} 👋
        </h2>

        <p className="text-gray-600 mt-2">
          Your exam dashboard
        </p>

      </main>

    </div>
  );
}

export default Dashboard;