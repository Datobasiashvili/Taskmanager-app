import Register from "./Register.jsx";
import Login from "./Login.jsx";
import Dashboard from "./Dashboard.jsx";
import Tasks from "./Tasks.jsx";
import UserLogged from "./userLogged.jsx";
import FavTasks from "./FavTasks.jsx";
import TaskManagerHero from "./Welcome-page.jsx";

import { useEffect } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       if (!token) {
  //         console.log("No token found, user not authenticated.");
  //         return;
  //       }

  //       const response = await axios.get(
  //         "http://localhost:8080/api/protected-route",
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );
  //       console.log("Authenticated User:", response.data.user);

  //     } catch (err) {
  //       const errorMsg = err.response?.data?.msg || "Authentication failed";
  //       console.error("Error:", errorMsg);

  //       // Only remove the token if the server indicates it's unauthorized
  //       if (err.response && err.response.status === 401) {
  //         localStorage.removeItem("token");
  //       }
  //     }
  //   };

  //   checkAuth();
  // }, []);

  return (
    <Router basename="/Taskmanager-app">
      <Routes>
        <Route path="/" element={<Navigate to="/Welcome" />} />
        <Route path="/Welcome"  element={<TaskManagerHero />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Tasks" element={<Tasks />} />
        <Route path="/Profile" element={<UserLogged />} />
        <Route path="/Favorite-Tasks" element={<FavTasks/>} />
      </Routes>
    </Router>
  );
}

export default App;
