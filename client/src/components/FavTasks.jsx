import Sidebar from "./Sidebar";
import "../styles/favTasks.css";
import axios from "axios";
import { useState, useEffect } from "react";

export default function FavTasks() {
  const [favTasks, setFavTasks] = useState([]);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFavTasks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/favorite-tasks",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200) {
          setFavTasks(response.data.favoriteTasks);
        }
      } catch (err) {
        console.error("Error during fetching", err);
        if (err.response && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("An error occurred during fetching data");
        }
      }
    };

    fetchFavTasks();
  }, []);

  const handleRemoveFavorite = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8080/api/favorite-tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFavTasks((prevFavTasks) =>
        prevFavTasks.filter((task) => task.taskId !== taskId)
      );
    } catch (err) {
      console.error("Error removing favorite task:", err);
      setError(err.message);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="fav-tasks">
        <h1>Favorite Tasks</h1>
        <ul>
          {favTasks.map((task) => (
            <li key={task.taskId}>
              <span className="fav-task-title">{task.title}</span>
              <p className="fav-task-description">{task.description}</p>
              <div className="fav-task-buttons">
                <button
                  id="remove-favorite"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFavorite(task.taskId);
                  }}
                >
                  Remove Favorite
                </button>
              </div>
            </li>
          ))}

          {error && (
            <p id="error" style={{ color: "red" }}>
              {error}
            </p>
          )}
          
        </ul>
      </div>
    </>
  );
}
