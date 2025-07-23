import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../styles/completedTasks.css";

function CompletedTasks() {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/completed-tasks",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200) {
          setCompletedTasks(response.data.completedTasks);
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

    fetchCompletedTasks();
  }, []);

  return (
    <>
      <Sidebar />
      <div className="Completed-tasks">
        <h1>Completed Tasks!</h1>
        <ul>
          {completedTasks.map((task) => (
            <li key={task.taskId}>
              <span className="compl-task-title">{task.title}</span>
              <p className="compl-task-description">{task.description}</p>
              <div className="compl-task-buttons">
                <button
                >
                    Mark as Incomplete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default CompletedTasks;
