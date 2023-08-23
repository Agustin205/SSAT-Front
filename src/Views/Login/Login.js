import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../Services/apiService";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { token } = await loginUser({ email, password });
      localStorage.setItem("gameToken", token);
      navigate("/");
      window.location.reload();
    } catch (error) {
      setErrorMessage("Contraseña o Email incorrectos");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;