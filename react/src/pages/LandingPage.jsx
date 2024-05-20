import { useEffect, useState } from "react";
import { FooterLanding } from "../components/Footer";
import { Header } from "../components/Header";
import { landingPhotoIcon } from "../components/Icons";
import { SearchBar } from "../components/SearchBar";
import "../styles/LandingPage.css";
import { getLatestGamesRequest } from "../api/igdb";
import { Loading } from "../components/Loading";
import { GameCarousel } from "../components/GameCarousel";

export default function LandingPage() {
  const [LatestgamesData, setLatestgamesData] = useState([]);

  useEffect(() => {
    const fetchLatestGames = async () => {
      try {
        const games = await getLatestGamesRequest();
        const sixGames = games.slice(0, 6);
        setLatestgamesData(sixGames);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLatestGames();
  }, []);
  return (
    <>
      <Header isLanding={true} headerClass={"landing-header"}/>
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
      <section className="landing-posibilities-section">
        <h2 className="landing-posibilities-title">POSIBILIDADES</h2>
        <div className="landing-posiibilities-container">
          <div className="landing-title-posibilities-container">
            <p className="landing-posibilities-image">
              <i className="bi bi-star-fill"></i>
            </p>
            <h5 className="landing-posibilities-subtitle">
              PUNTÚA TUS FAVORITOS
            </h5>
          </div>
          <p className="landing-posibilities-paragraph">
            Añade la nota que el juego se merece. Tu perspectiva es fundamental
            para ayudarte a decubrir joyas ocultas y nuevas experiencias que
            valen la pena
          </p>
        </div>
        <div className="landing-posiibilities-container">
          <div className="landing-title-posibilities-container">
            <p className="landing-posibilities-image">
              <i className="bi bi-search-heart-fill"></i>
            </p>
            <h5 className="landing-posibilities-subtitle">
              TODO EN UN MISMO LUGAR
            </h5>
          </div>
          <p className="landing-posibilities-paragraph">
            Ya no necesitas saltar entre plataformas, aquí encontrarás un
            universo de juegos con tan solo una búsqueda
          </p>
        </div>
        <div className="landing-posiibilities-container">
          <div className="landing-title-posibilities-container">
            <p className="landing-posibilities-image">
              <i className="bi bi-robot"></i>
            </p>
            <h5 className="landing-posibilities-subtitle">
              EXPLORA NUEVOS JUEGOS
            </h5>
          </div>
          <p className="landing-posibilities-paragraph">
            Rompe la monotonía y aventúrate en títulos que se adaptan
            perfectamente a tu estilo. Deja que la Inteligencia Artificial eleve
            tu experiencia de juego
          </p>
        </div>
        <div className="landing-posiibilities-container">
          <div className="landing-title-posibilities-container">
            <p className="landing-posibilities-image">
              <i className="bi bi-collection-fill"></i>
            </p>
            <h5 className="landing-posibilities-subtitle">
              ORGANIZA TU COLECCIÓN
            </h5>
          </div>
          <p className="landing-posibilities-paragraph">
            Crea listas a medida para tus juegos favoritos y gestionalos como
            nunca antes. Tendrás el control total sobre tu biblioteca de juegos
          </p>
        </div>
      </section>
      <section className="landing-posibilities-section">
        <h2 className="landing-latest-title">NUEVOS LANZAMIENTOS</h2>
        <p className="landing-latest-paragraph">
          Estamos comprometidos a mantenerte al tanto de las últimas
          incorporaciones, asegurándonos de que siempre tengas algo nuevo que
          explorar
        </p>
        <SearchBar />
        <div className="landing-games">
          {LatestgamesData.length == 0 ? (
            <Loading />
          ) : (
            LatestgamesData.map((game) => (
              <GameCarousel game={game} key={game.id} />
            ))
          )}
        </div>
      </section>
      <FooterLanding />
    </>
  );
}
