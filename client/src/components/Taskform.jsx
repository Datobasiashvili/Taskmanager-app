import { useState } from "react";
import axios from "axios";
import "../styles/taskform.css";

function Taskform() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  //Adding a task to the server
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !date) {
      setError("Provide  title, description and date");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/tasks",
        { title, description, date },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setTitle("");
        setDescription("");
        setError(null);
        setSuccessMessage("Task added successfully!");
      } else {
        setError("Server side error, Failed to add task.");
      }
    } catch (err) {
      setError(
        err.response?.data?.msg || "Failed to add task. Please try again."
      );
      console.error(err);
      setSuccessMessage("");
    }
  };

  return (
    <div className="task-form">
      <form onSubmit={handleSubmit}>
        <h1 id="tasks-title">Tasks</h1>

        <div className="form-section title-section">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-section description-section">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-section bottom-section">
          <div className="date-input">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <button id="submit-button" type="submit">
            Add Task
          </button>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      </form>
    </div>
  );
}

export default Taskform;

