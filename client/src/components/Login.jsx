import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import "../styles/login.css";

function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  //UseState did not work, be cause when we we're coming back to the log in page, the state was refreshing and setting to false again, so even if the user was logged in, the log in page was rendering anyways. so nowe we use the useEffect instead.

  //  Check localStorage when component loads
  const accessToken = localStorage.getItem("token");
  
  useEffect(() => {
    const checkTokenValidity = async () => {
      if (!accessToken) return;

      try {
        const response = await axios.get(
          "http://localhost:8080/api/validate-token",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (response.status === 200) {
          navigate("/Profile");
        }
      } catch (err) {
        console.error("Token validation failed", err);
        localStorage.removeItem("token"); //Clear invalid token
        navigate("/Login") //Redirect to login page
        setError(err.message);
      }
    };
    checkTokenValidity();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { email: loginEmail, password: loginPassword };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/login",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const token = response.data.accessToken;

      if (response.status === 200 && token) {
        console.log("Logged in successfully:");

        localStorage.setItem("token", token);
        navigate("/Dashboard");

        setLoginEmail("");
        setLoginPassword("");
      }
    } catch (error) {
      console.error("Error during registation:", error);
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred during login.");
      }
    }
  };

  const togglePassword = (e) => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <>
        <div className="login-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <h1>Login</h1>
            <input
              id="email"
              type="text"
              placeholder="Email"
              name="email"
              autoComplete="off"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
            <div className="password-container">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                autoComplete="off"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                maxLength={20}
              />
              <button id="show-password" type="button" onClick={togglePassword}>
                <svg
                  id="eyeOpen"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  style={{ display: showPassword ? "inline" : "none" }}
                >
                  <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                </svg>

                <svg
                  id="eyeClosed"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  style={{ display: showPassword ? "none" : "inline" }}
                >
                  <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                </svg>
              </button>
            </div>
            <button type="submit">Login</button>
            {error && (
              <p id="error" style={{ color: "red" }}>
                {error}
              </p>
            )}
            <Link id="register-link" to="/register">
              <p>Don't have an account? Sign up</p>
            </Link>
          </form>
        </div>
      </>
    </>
  );
}

export default Login;


