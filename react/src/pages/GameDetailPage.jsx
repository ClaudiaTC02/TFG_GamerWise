import { useParams } from "react-router-dom";
import { CarouselSection } from "../components/CarouselSection";
import datamock from "../mock/latestGame.json";
import { Header } from "../components/Header";
import { defaultCoverIcon } from "../components/Icons";
import "../styles/GameDetailPage.css";
import { useEffect, useState } from "react";
import { getGameDetailsRequest } from "../api/igdb";
import { useAuth } from "../hooks/useAuth";
import { newRatingLogic } from "../logic/ratingLogic";
import { getRatingRequest } from "../api/rating";
import { getGameRequest } from "../api/game";

export default function GameDetailPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [gameDetails, setGameDetails] = useState([]);
  const [rating, setRating] = useState(0);
  const [rated, setRated] = useState(false);

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
    const fetchRating = async () => {
      try {
        const game = await getGameRequest(id, token)
        if(game){
          const rating = await getRatingRequest(game.game[0].id, token)
          setRating(rating)
          setRated(true)
          console.log(rating);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchDetails();
    fetchRating()
  }, [id, token]);

  const handleRatingChange = async (value) => {
    try {
      if (value === rating) {
        setRating(0);
        // TO DO: eliminar la calificación
      } else {
        setRating(value);
        if(rated){
          console.log('Actualizo')
        } else{
          await newRatingLogic(id, token, gameDetails, value)
        }
      }
    } catch (error) {
      console.error("Error al manejar el cambio de calificación:", error);
    }
  };
  

  const renderStars = () => {
    const stars = [];
    const maxRating = 5;
    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => handleRatingChange(i)}
          className={rated ? (i <= rating ? "bi bi-star-fill rated" : "bi bi-star rated") : (i <= rating ? "bi bi-star-fill" : "bi bi-star")}
        />
      );
    }
    return stars;
  };

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
            <div className="detail-star-container">{renderStars()}</div>
            <button className="detail-addList-button">Añadir a lista</button>
          </div>
          <div className="detail-container-left">
            <div className="detail-container-info">
              <div className="detail-container-title">
                <h1 className="detail-title">{gameDetails.name}</h1>
                <h3 className="detail-subtitle">
                  {gameDetails.involved_companies &&
                    gameDetails.involved_companies
                      .map((company) => company.company.name)
                      .join(", ")}
                </h3>
              </div>
              <i className="bi bi-heart"></i>
            </div>
            <p className="detail-gender">
              Género:{" "}
              {gameDetails.genres &&
                gameDetails.genres.map((genre) => genre.name).join(", ")}
            </p>
            <p className="detail-platforms">
              Plataformas:{" "}
              {gameDetails.platforms &&
                gameDetails.platforms
                  .map((platforms) => platforms.abbreviation)
                  .join(", ")}
            </p>
          </div>
        </div>
        <div className="detail-container-description">
          <h5 className="detail-title-description">Desripción</h5>
          <p className="detail-text-description">
            {gameDetails.summary && gameDetails.summary}
          </p>
        </div>
      </section>
      <CarouselSection gamesData={datamock} text="También puede gustarte" />
    </>
  );
}
