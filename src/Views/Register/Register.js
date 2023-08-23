import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../Services/apiService";
import "./Register.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden.");
    } else {
      setErrorMsg("");
      try {
        await registerUser({ email, password });
        navigate("/login");
      } catch (error) {
        if (error.response && error.response.data.errors) {
          setErrorMsg(error.response.data.errors[0].msg);
        } else {
          setErrorMsg("Error de registro. Por favor, inténtalo de nuevo.");
        }
      }
    }
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <h1>Registro</h1>
        {errorMsg && <div className="error">{errorMsg}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
