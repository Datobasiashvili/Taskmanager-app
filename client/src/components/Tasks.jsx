import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { FaRegCircleCheck } from "react-icons/fa6";
import { FaCircleCheck } from "react-icons/fa6";
import "../styles/tasks.css";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null);
  const [favoriteTasks, setFavoriteTasks] = useState([]);

  const token = localStorage.getItem("token");

  // Fetch regular tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.status === 200) setTasks(response.data.tasks);
      } catch (error) {
        console.error("Error during registation:", error);
        if (error.response && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError("An error occurred during login. Please login again");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Fetch favorite tasks and sync UI state
  useEffect(() => {
    const fetchFavoriteTasks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/favorite-tasks",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const favoriteTaskIds = response.data.favoriteTasks.map(
          (task) => task._id
        );
        setFavoriteTasks(favoriteTaskIds);
        // Store the favorite tasks in localStorage for persistence
        localStorage.setItem("favoriteTasks", JSON.stringify(favoriteTaskIds));
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    };

    // Load favorite tasks from localStorage if available
    const storedFavoriteTasks = JSON.parse(
      localStorage.getItem("favoriteTasks")
    );
    if (storedFavoriteTasks) {
      setFavoriteTasks(storedFavoriteTasks);
    } else {
      fetchFavoriteTasks(); // Fetch from API if not in localStorage
    }
  }, []);

  const toggleExpand = (taskId) => {
    setExpandedTask((prev) => (prev === taskId ? null : taskId));
  };

  const handleDelete = async (taskId) => { 
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task.taskId !== taskId));
      // Remove from favorites if deleted task was a favorite
      setFavoriteTasks((prev) => prev.filter((favTask) => favTask.taskId !== taskId));

      const updatedFavorites = JSON.parse(
        localStorage.getItem("favoriteTasks") || "[]"
      ).filter((favTask) => favTask.taskId !== taskId);
      localStorage.setItem("favoriteTasks", JSON.stringify(updatedFavorites));

    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message);
    }
  };

  const handleAddFavorite = async (task) => {
    if (favoriteTasks.includes(task.taskId)) return;

    try {
      const response = await axios.post(
        "http://localhost:8080/api/favorite-tasks",
        {
          taskId: task.taskId,
          title: task.title,
          description: task.description,
          date: new Date(task.date).toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        setFavoriteTasks((prev) => {
          const updatedFavorites = [...prev, task._id];

          localStorage.setItem(
            "favoriteTasks",
            JSON.stringify(updatedFavorites)
          ); // Update localStorage
          return updatedFavorites;
        });
      }
    } catch (err) {
      console.error("Favorite error:", err.response?.data?.msg || err.message);
      setError(err.response?.data?.msg || "Failed to add favorite");
    }
  };

  if (loading) return <p>Loading Tasks...</p>;

  return (
    <>
      <Sidebar />
      <div className="tasks">
        <h1>Task List</h1>
        <ul>
          {tasks.map((task) => (
            <li
              key={task._id}
              className={expandedTask === task._id ? "expanded" : ""}
              onClick={() => toggleExpand(task._id)}
            >
              <span className="task-title">{task.title}</span>
              <p className="task-description">{task.description}</p>
              <div className="task-buttons">
                <button
                  id="delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(task.taskId);
                  }}
                >
                  Delete
                </button>
                <button
                  id="add-to-favorite"
                  className={
                    favoriteTasks.includes(task._id)
                      ? "clicked-favorite-button"
                      : ""
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddFavorite(task);
                  }}
                  disabled={favoriteTasks.includes(task._id)}
                >
                  {favoriteTasks.includes(task._id)
                    ? "★ Favorited"
                    : "☆ Add Favorite"}
                </button>
                <button 
                  id="completed-button"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <FaRegCircleCheck id="completed-button-icon"/>
                </button>
              </div>
            </li>
          ))}
        </ul>
        {error && (
          <p id="error" style={{ color: "red" }}>
            {error}
          </p>
        )}
      </div>
    </>
  );
}

export default Tasks;
