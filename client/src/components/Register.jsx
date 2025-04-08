import { useState } from "react";
import axios from "axios";
import "../styles/register.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [comfirmPassword, setComfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      password,
    };

    if (password !== comfirmPassword) {
      setError("Password do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/register",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Registered successfully:", response.data);
        setError(null);
        navigate("/login");
      }

      setEmail("");
      setPassword("");
      setComfirmPassword("");
    } catch (err) {
      console.error("Error during registation:", err);
      if (err.response) {
        setError(err.response.data.message || "Registration failed.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h1>Sign up</h1>
        <input
          id="name"
          type="text"
          placeholder="Name"
          name="name"
          autoComplete="off"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          id="email"
          type="email"
          placeholder="Email"
          name="email"
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        ></input>
        <input
          id="register-password"
          type="password"
          placeholder="Password"
          name="password"
          autoComplete="off"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        ></input>
        <input
          id="comfirm-password"
          type="password"
          placeholder="Confirm Password"
          name="comfirm-password"
          autoComplete="off"
          value={comfirmPassword}
          onChange={(e) => setComfirmPassword(e.target.value)}
          required
        ></input>

        {error && (
          <p id="error" style={{ color: "red" }}>
            {error}
          </p>
        )}

        <Link id="login-link" to="/login">
          <p>Already have an account? Log in</p>
        </Link>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Register;
