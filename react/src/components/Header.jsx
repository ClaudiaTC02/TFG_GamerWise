import "../styles/Header.css";

import logo from "../assets/logo_gamerwise.png";
import { useState } from "react";
export function Header() {
    const [navClassName, setNavClassName] = useState("nav");
    const handleOpenMenu = () => {
        setNavClassName("nav visible")
    }
    const handleCloseMenu = () => {
        setNavClassName('nav')
    }
  return (
    <header>
      <img className="logo" src={logo} alt="logo gamerwise buho" />
      <div className="options-container">
        <button className="register-button" href='/register'>Sign in</button>
        <button className="open-menu" onClick={() => handleOpenMenu()}><i className="bi bi-list"></i></button>
        <nav className={navClassName}>
          <button className="close-menu" onClick={() => handleCloseMenu()}><i className="bi bi-x"></i></button>
          <ul className="nav-list">
            <li>Inicio</li>
            <li>Posibilidades</li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
