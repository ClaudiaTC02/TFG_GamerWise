import { useParams } from "react-router-dom";
import { CarouselSection } from "../components/CarouselSection";
import datamock from "../mock/latestGame.json";
import { Header } from "../components/Header";
import { defaultCoverIcon } from "../components/Icons";
import "../styles/GameDetailPage.css";
import { useEffect, useState } from "react";
import { getGameDetailsRequest } from "../api/igdb";

export default function GameDetailPage() {
  const { id } = useParams();
  const [gameDetails, setGameDetails] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const game = await getGameDetailsRequest(id);
        if (game.length > 0) {
          setGameDetails(game[0]);
        } else {
          console.log("No se encontraron detalles del juego");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchDetails();
  }, [id]);

  if (gameDetails.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <section className="detail-section">
        <div className="detail-container">
          <div className="detail-container-right">
            <img
              className="detail-cover"
              src={
                gameDetails.cover
                  ? gameDetails.cover.url.replace("t_thumb", "t_cover_big")
                  : defaultCoverIcon()
              }
              alt={gameDetails.name}
            />
            <p className="detail-rating">Puntúalo</p>
            <div className="detail-star-container">
              <i className="bi bi-star"></i>
              <i className="bi bi-star"></i>
              <i className="bi bi-star"></i>
              <i className="bi bi-star"></i>
              <i className="bi bi-star"></i>
            </div>
            <button className="detail-addList-button">Añadir a lista</button>
          </div>
          <div className="detail-container-left">
            <div className="detail-container-info">
              <div className="detail-container-title">
                <h1 className="detail-title">{gameDetails.name}</h1>
                <h3 className="detail-subtitle">
                  {gameDetails.involved_companies && gameDetails.involved_companies
                    .map((company) => company.company.name)
                    .join(", ")}
                </h3>
              </div>
              <i className="bi bi-heart"></i>
            </div>
            <p className="detail-gender">
              Género: {gameDetails.genres && gameDetails.genres.map((genre) => genre.name).join(", ")}
            </p>
            <p className="detail-platforms">
              Plataformas:{" "}
              {gameDetails.platforms && gameDetails.platforms
                .map((platforms) => platforms.abbreviation)
                .join(", ")}
            </p>
          </div>
        </div>
        <div className="detail-container-description">
          <h5 className="detail-title-description">Desripción</h5>
          <p className="detail-text-description">{gameDetails.summary && gameDetails.summary}</p>
        </div>
      </section>
      <CarouselSection gamesData={datamock} text="También puede gustarte" />
    </>
  );
}
