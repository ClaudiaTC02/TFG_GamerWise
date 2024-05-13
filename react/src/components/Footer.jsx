import { logoIcon } from "./Icons";
import "../styles/Footer.css";

export function FooterLanding() {
  return (
    <footer>
      <div className="footer-landing-container">
        <div className="footer-landing-texts">
            <p className="footer-landing-relog">Regístrate o Inicia Sesión</p>
            <p className="footer-landing-slog">¡Vive una Experiencia Gaming Personalizada!</p>
        </div>
        <div className="footer-landing-buttons">
            <button className="footer-register">Regístrate</button>
            <button className="footer-login">Inicia Sesión</button>
        </div>
      </div>
      <hr className="footer-line"/>
      <div className="footer-content">
        <img className="logo-footer" src={logoIcon()} alt="logo gamerwise buho" ></img>
        <div className="footer-options-container">
            <p className="footer-option">Sobre mi</p>
            <p className="footer-option">Sugerencias</p>
            <p className="footer-option">Políticas</p>
        </div>
        <p className="footer-end">
          Diseñado por Claudia Torres Cruz © 2024 Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export function Footer() {
    return (
      <footer>
        <div className="footer-content">
          <img className="logo-footer" src={logoIcon()} alt="logo gamerwise buho" ></img>
          <div className="footer-options-container">
              <p className="footer-option">Sobre mi</p>
              <p className="footer-option">Sugerencias</p>
              <p className="footer-option">Políticas</p>
          </div>
          <p className="footer-end">
            Diseñado por Claudia Torres Cruz © 2024 Todos los derechos reservados.
          </p>
        </div>
      </footer>
    );
  }
  
