import "../styles/Welcome-page.css";
import { useNavigate } from "react-router-dom";

import React from "react";
import "../styles/Welcome-page.css";

export const TaskManagerHero = () => {
  const navigate = useNavigate();

  return (
    <div className="desktop">
      <div className="div">
        <img
          className="team-checklist-cuate"
          alt="Team checklist cuate"
          src="https://c.animaapp.com/m9757xix2Dq251/img/team-checklist-cuate-1.png"
        />

        <div className="frame">
          <div className="text">
            <div className="text-frame">
              <div className="text-wrapper">Task Manager</div>

              <div className="text-wrapper-2">App</div>
            </div>

            <p className="welcome-back-manage">
              Welcome Back!
              <br />
              Manage your tasks easily and stay organized. <br />
              Add, track, and complete tasks effortlessly
            </p>
          </div>

          <button className="get-started-button" onClick={() => navigate("/Login")}>
            <div className="text-wrapper-3">Get started</div>

            <img
              className="mdi-light-arrow"
              alt="Mdi light arrow"
              src="https://c.animaapp.com/m9757xix2Dq251/img/mdi-light-arrow-right.svg"
            />
          </button>
        </div>

        <div className="frame-2">
          <div className="navbar">
            <div className="navbar-link text-wrapper-4">Home</div>

            <div className="navbar-link text-wrapper-5">About us</div>

            <div className="navbar-link text-wrapper-6">Services</div>

            <div className="navbar-link text-wrapper-7">Contact Us</div>
          </div>

          <img
            className="material-symbols"
            alt="Material symbols"
            src="https://c.animaapp.com/m9757xix2Dq251/img/material-symbols-task-outline-rounded.svg"
          />
        </div>
      </div>
    </div>
  );
};

export default TaskManagerHero;
