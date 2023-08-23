import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./topbar.css";
import User from "../Topbar/user.jpg";
import { Form } from "react-bootstrap";
import { getClients, getLote } from "../../Services/apiService";

function Topbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [clients, setClients] = useState([]);
  const [lotes, setLotes] = useState([]);
  const navigate = useNavigate();

  const handleLotes = async (idCliente) => {
    try {
      await getLote(idCliente).then((result) => {
        setLotes(result.data);
        if (result.data.length > 0) {
          localStorage.setItem("loteId", result.data[0].id);
        } else {
          localStorage.setItem("loteId", 0);
        }
      });
    } catch (error) {
      console.log(error, "error en el handleLotes");
    }
  };

  const handleClients = async () => {
    try {
      await getClients().then((result) => {
        setClients(result.data);
        localStorage.setItem("clientId", result.data[0].id);
        localStorage.setItem("clientName", result.data[0].name);
        handleLotes(result.data[0].id);
      });
    } catch (error) {
      console.log(error, "error en el handleClients");
    }
  };

  const onChangeClient = (event) => {
    try {
      let pos = clients
        .map((cliente) => cliente.name)
        .indexOf(event.target.value);
      let id = clients[pos].id;
      let name = clients[pos].name;
      localStorage.setItem("clientId", id);
      localStorage.setItem("clientName", name);
      handleLotes(id);
    } catch (error) {
      console.log(error, "error al cambiar los clientes");
    }
  };

  const onChangeLote = (event) => {
    try {
      let pos = lotes.map((lote) => lote.name).indexOf(event.target.value);
      let id = lotes[pos].id;
      localStorage.setItem("loteId", id);
    } catch (error) {
      console.log(error, "error al cambiar los lotes");
    }
  };

  useEffect(() => {
    try {
      const token = localStorage.getItem("gameToken");
      setIsLoggedIn(token !== null);
      handleClients();
    } catch (error) {
      console.log(error, "error al cargar");
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("gameToken");
      setIsLoggedIn(false);
      navigate("/login");
      window.location.reload();
    } catch (error) {
      console.log(error, "error al deslogearse");
    }
  };

  return (
    <div class="topbar">
      <div className="topbar-left">
        {!isLoggedIn ? (
          <></>
        ) : (
          <>
            <span className="customer">Cliente:</span>
            <Form.Select
              className="busTran"
              onChange={(e) => onChangeClient(e)}
            >
              {clients.map((data) => (
                <option value={data.name}>{data.name}</option>
              ))}
            </Form.Select>
            <span style={{ marginLeft: "5%" }} className="customer">
              Lote:
            </span>
            <Form.Select className="busTran" onChange={(e) => onChangeLote(e)}>
              {lotes.map((data) => (
                <option value={data.name}>{data.name}</option>
              ))}
            </Form.Select>
          </>
        )}
      </div>
      <div className="topbar-right">
        <div className="user-info">
          <span className="username">Username</span>
          <img className="avatar" src={User} alt="avatar" />
        </div>
        {!isLoggedIn ? (
          <>
            <button className="nav-menu-btn" onClick={() => navigate("/login")}>
              Iniciar sesión
            </button>
            <button
              className="nav-menu-btn"
              onClick={() => navigate("/register")}
            >
              Registrarse
            </button>
          </>
        ) : (
          <button className="nav-menu-btn" onClick={handleLogout}>
            Cerrar sesión
          </button>
        )}
      </div>
    </div>
  );
}

export default Topbar;
