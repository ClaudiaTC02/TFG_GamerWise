import { FooterLanding } from "../components/Footer";
import { Header } from "../components/Header";
import { landingPhotoIcon } from "../components/Icons";
import "../styles/LandingPage.css";

export default function LandingPage() {
  return (
    <>
      <Header isLanding={true} />
      <section>
        <div className="landing-title-container">
          <h1 className="landing-title">
            CADA <span className="highlited-text">JUGADOR</span> MERECE SU JUEGO{" "}
            <span className="highlited-text">PERFECTO</span>
          </h1>
        </div>
        <div className="landing-image-container">
          <img
            className="landing-photo"
            src={landingPhotoIcon()}
            alt="chica gamer"
          ></img>
        </div>
        <div className="landing-option-super-container">
          <div className="landing-option-container">
            <h3 className="landing-title-option">Organiza</h3>
            <p className="landing-paragraph-option">
              Añade juegos a listas únicas y puntúalos
            </p>
          </div>
          <div className="landing-option-container">
            <h3 className="landing-title-option">Descubre</h3>
            <p className="landing-paragraph-option">
              Recibe recomendaciones personalizadas
            </p>
          </div>
        </div>
        <div className="landing-end-container">
          <button className="landing-joinus">Únete</button>
          <a className="landing-goDown">
            <i className="bi bi-chevron-down"></i>
          </a>
        </div>
      </section>
      <FooterLanding/>
    </>
  );
}
