import { useTranslation } from "react-i18next";
import "../styles/Header.css";

import { logoIcon, userIcon } from "./Icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import { useAuth } from "../hooks/useAuth";

export function Header({ isLanding, isLogged, headerClass }) {
  const navigate = useNavigate();
  const handleLogo = () => {
    if (isLanding) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };
  return (
    <header className={headerClass}>
      <a href="/" onClick={handleLogo}>
        <img className="logo" src={logoIcon()} alt="logo gamerwise buho" />
      </a>
      {isLanding && <LandingHeader />}
      {isLogged && <LoggedHeader />}
      {!isLanding && !isLogged && <LanguageSelector />}
    </header>
  );
}

const LandingHeader = () => {
  const [navClassName, setNavClassName] = useState("nav");
  const { t } = useTranslation("header");
  const navigate = useNavigate();

  const handleOpenMenu = () => {
    setNavClassName("nav visible");
  };
  const handleCloseMenu = () => {
    setNavClassName("nav");
  };
  const handleSignIn = () => {
    navigate("/login");
  };
  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
    setNavClassName("nav"); 
  };
  return (
    <div className="options-container">
      <button className="register-button" onClick={handleSignIn}>
        {t("button")}
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
            <a href="#home" onClick={() => scrollToSection("home")}>{t("home")}</a>
          </li>
          <li>
            <a href="#posibilities" onClick={() => scrollToSection("posibilities")}>{t("posibilities")}</a>
          </li>
          <li>
            <a href="#latest" onClick={() => scrollToSection("latest")}>{t("latest")}</a>
          </li>
          <li>
            <a>
              <LanguageSelector />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

const LoggedHeader = () => {
  const [navClassName, setNavClassName] = useState("nav");
  const {signOut} = useAuth();
  const navigate = useNavigate();

  const handleOpenMenu = () => {
    setNavClassName("nav visible");
  };
  const handleCloseMenu = () => {
    setNavClassName("nav");
  };
  function handleLogout() {
    signOut()
    console.log('Sesión cerrada');
  }
  function handleProfile() {
    navigate('/profile');
  }
  function handleSettings() {
    navigate('/profile#options');
  }
  return (
    <div className="options-container">
      <button className="open-menu" onClick={handleOpenMenu}>
        <div className="header-user-container">
          <img className="user-image" src={userIcon()} alt='user'/>
          <i className="bi bi-chevron-down"></i>
        </div>
      </button>
      <nav className={navClassName}>
        <button className="close-menu" onClick={handleCloseMenu}>
          <i className="bi bi-x"></i>
        </button>
        <ul className="nav-list">
          <li>
            <a onClick={handleProfile}>Mi perfil</a>
          </li>
          <li>
            <a onClick={handleSettings}>Ajustes</a>
          </li>
          <li>
            <a onClick={handleLogout}>Cerrar sesión</a>
          </li>
          <li>
            <a>
              <LanguageSelector />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
