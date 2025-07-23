import React, { useState } from "react";
import "../styles/sidebar.css"
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigate = useNavigate();

  return (
    <>
      <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-elements">
          <div className="task-manager-app-wrapper">
            <p className="task-manager-app">
              <span className="span">Task Manager<br /></span>
              <span className="text-wrapper-2">App</span>
            </p>
          </div>

          <div className="frame" onClick={() => navigate("/Dashboard")}>
            <div className="img">
              <img className="group" alt="Group" src="https://c.animaapp.com/m97b9bedhKXThF/img/group.png" />
            </div>
            <div className="text-wrapper">Dashboard</div>
          </div>

          <div className="frame" onClick={() => navigate("/Profile")}>
            <img className="img" alt="Mdi user" src="https://c.animaapp.com/m97b9bedhKXThF/img/mdi-user.svg" />
            <div className="text-wrapper">Profile</div>
          </div>

          <div className="frame" onClick={() => navigate("/Tasks")}>
            <img className="img" alt="Fluent tasks app" src="https://c.animaapp.com/m97b9bedhKXThF/img/fluent-tasks-app-28-filled.svg" />
            <div className="text-wrapper">Tasks</div>
          </div>

          <div className="frame" onClick={() => navigate("/Favorite-Tasks")}>
            <img className="img" alt="Uim favorite" src="https://c.animaapp.com/m97b9bedhKXThF/img/uim-favorite.svg" />
            <div className="text-wrapper">Favorites</div>
          </div>

          <div className="frame" onClick={() => navigate("/Completed-Tasks")}>
            <img className="img" alt="Uim favorite" src="https://c.animaapp.com/m97b9bedhKXThF/img/uim-favorite.svg" />
            <div className="text-wrapper">Completed</div>
          </div>

        </div>
      </div>

      <img
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`shrink-navbar-button ${isCollapsed ? "collapsed" : ""}`}
        alt="Toggle sidebar"
        src="https://c.animaapp.com/m97b9bedhKXThF/img/shrink-navbar-button.svg"
      />
    </>
)}
