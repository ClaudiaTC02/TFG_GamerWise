import { useTranslation } from "react-i18next";
import "../styles/Header.css";

import { logoIcon, userIcon } from "./Icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import { useAuth } from "../hooks/useAuth";

export function Header({ isLanding, isLogged, headerClass }) {
  const navigate = useNavigate();
  const handleLogo = (e) => {
    e.preventDefault();
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
  const scrollToSection = (e, id) => {
    if (id === "home") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(id);
      const headerHeight = document.querySelector("header").offsetHeight;
      const top =
        el.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setNavClassName("nav");
  };
  return (
    <div className="options-container">
      <button className="register-button mobile" onClick={handleSignIn}>
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
            <a href="#home" onClick={(e) => scrollToSection(e, "home")}>
              {t("home")}
            </a>
          </li>
          <li>
            <a
              href="#posibilities"
              onClick={(e) => scrollToSection(e, "posibilities")}
            >
              {t("posibilities")}
            </a>
          </li>
          <li>
            <a href="#latest" onClick={(e) => scrollToSection(e, "latest")}>
              {t("latest")}
            </a>
          </li>
          <li>
            <a href="#explore" onClick={(e) => scrollToSection(e, "explore")}>
              {t("explore")}
            </a>
          </li>
          <li>
            <a>
              <LanguageSelector />
            </a>
          </li>
        </ul>
      </nav>
      <button className="register-button pc" onClick={handleSignIn}>
        {t("button")}
      </button>
    </div>
  );
};

const LoggedHeader = () => {
  const [navClassName, setNavClassName] = useState("nav");
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleOpenMenu = () => {
    setNavClassName("nav visible");
  };
  const handleCloseMenu = () => {
    setNavClassName("nav");
  };
  function handleLogout() {
    signOut();
    console.log("Sesión cerrada");
  }
  function handleProfile() {
    navigate("/profile");
  }
  function handleHome() {
    navigate("/");
  }
  return (
    <div className="options-container">
      <button className="open-menu" onClick={handleOpenMenu}>
        <div className="header-user-container">
          <img className="user-image" src={userIcon()} alt="user" />
          <i className="bi bi-chevron-down"></i>
        </div>
      </button>
      <nav className={navClassName}>
        <button className="close-menu" onClick={handleCloseMenu}>
          <i className="bi bi-x"></i>
        </button>
        <ul className="nav-list">
          <li>
            <a onClick={handleHome}>Inicio</a>
          </li>
          <li>
            <a onClick={handleProfile}>Mi perfil</a>
          </li>
          <li>
            <a>
              <LanguageSelector />
            </a>
          </li>
          <li>
            <a className="signout-button mobile" onClick={handleLogout}>Cerrar sesión</a>
          </li>
        </ul>
      </nav>
      <button className="signout-button pc" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
};
