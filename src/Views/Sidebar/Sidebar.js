import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../Sidebar/logo.png";
import { Link } from "react-router-dom";
import "./sidebar.css";

const Sidebar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const token = localStorage.getItem("gameToken");
      setIsLoggedIn(token !== null);
    } catch (error) {
      console.log(error, "error en el useEffect");
    }
  }, []);

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <img className="img-logo" src={logo} alt="logo" />
      </div>
      {!isLoggedIn ? (
        <>
          <ul className="sidebar-menu">
            <li className="sidebar-menu-item">
              <Link to="/login" className="nav-link">
                <i className="nc-icon nc-circle-09"></i>
                <p>Iniciar Sesion</p>
              </Link>
            </li>
          </ul>
        </>
      ) : (
        <>
          <ul className="sidebar-menu">
            <li className="sidebar-menu-item">
              <Link to="/" className="nav-link">
                <i className="nc-icon nc-circle-09"></i>
                <p>Inicio</p>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/managedata" className="nav-link">
                <i className="nc-icon nc-circle-09"></i>
                <p>Importación Tablas</p>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/transactions" className="nav-link">
                <i className="nc-icon nc-circle-09"></i>
                <p>Transacciones</p>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/objects" className="nav-link">
                <i className="nc-icon nc-circle-09"></i>
                <p>Objetos de Autorización</p>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/admLotes" className="nav-link">
                <i className="nc-icon nc-circle-09"></i>
                <p>Administrar lotes</p>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/profile" className="nav-link">
                <i className="nc-icon nc-circle-09"></i>
                <p>Perfil</p>
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/config" className="nav-link">
                <i className="nc-icon nc-circle-09"></i>
                <p>Configuracion</p>
              </Link>
            </li>
          </ul>
        </>
      )}
    </nav>
  );
};

export default Sidebar;
