import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import "../styles/userLogged.css";
import axios from "axios";
import { useState, useEffect } from "react";

export default function UserLogged() {
    const [error, setError] = useState(null);
    const [user, setUser] = useState("")


  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/userLogged",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUser(response.data.name);
      } catch (err) {
        console.error(`Error:`, err);
        setError(
            err.response?.data?.msg || "Server Error, please come back later"
          );
      }
    };

    getUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="user-logged-container">
      <Sidebar />
      <div className="user-logged-content">
        <h1>Welcome Back {user}!</h1>
        <p>You are successfully logged in. Feel free to explore the app.</p>
        <button className="logout-button" onClick={handleLogout}>
          Log Out
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}
