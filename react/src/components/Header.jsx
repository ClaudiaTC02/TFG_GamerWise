import "../styles/Header.css";

import { logoIcon } from "./Icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Header({ isLanding }) {
  const navigate = useNavigate();
  const handleLogo = () => {
    if (isLanding) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };
  return (
    <header>
      <a href="/" onClick={handleLogo}>
        <img className="logo" src={logoIcon()} alt="logo gamerwise buho" />
      </a>
      {isLanding && <LandingHeader />}
    </header>
  );
}

const LandingHeader = () => {
  const [navClassName, setNavClassName] = useState("nav");
  const navigate = useNavigate();

  const handleOpenMenu = () => {
    setNavClassName("nav visible");
  };
  const handleCloseMenu = () => {
    setNavClassName("nav");
  };
  const handleSignIn = () => {
    navigate("/register");
  };
  return (
    <div className="options-container">
      <button className="register-button" onClick={handleSignIn}>
        Sign in
      </button>
      <button className="open-menu" onClick={handleOpenMenu}>
        <i className="bi bi-list"></i>
      </button>
      <nav className={navClassName}>
        <button className="close-menu" onClick={handleCloseMenu}>
          <i className="bi bi-x"></i>
        </button>
        <ul className="nav-list">
          <li>
            <a>Inicio</a>
          </li>
          <li>
            <a>Posibilidades</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};
