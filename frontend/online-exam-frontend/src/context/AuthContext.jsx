import { createContext,  useContext,  useEffect,  useState, } from "react";

import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [loading, setLoading] = useState(true);

  const register = async (name, email, password) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });

    return response.data;
  };
  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });


    const { token, user } = response.data;

    localStorage.setItem("token", token);

    setToken(token);
    setUser(user);

    return response.data;
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
};

  const logout = () => {
    localStorage.removeItem("token");

    setToken(null);
    setUser(null);
  };

  // Load logged-in user when application starts
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        setUser(response.data.user);
      } catch (error) {
        console.error("Session expired or invalid");

        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{  user, token, loading, register, login, updateUser, logout, }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};