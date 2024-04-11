import { useTranslation } from "react-i18next";
import "../styles/Header.css";

import { logoIcon } from "./Icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";

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
      {!isLanding && <LanguageSelector />}
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
    navigate("/register");
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
            <a>{t("home")}</a>
          </li>
          <li>
            <a>{t("posibilities")}</a>
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
