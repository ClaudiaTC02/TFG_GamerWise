import { useParams } from "react-router-dom";
import { CarouselSection } from "../components/CarouselSection";
import datamock from "../mock/latestGame.json";
import { Header } from "../components/Header";
import { defaultCoverIcon } from "../components/Icons";
import "../styles/GameDetailPage.css";
import { useEffect, useState } from "react";
import { getGameDetailsRequest } from "../api/igdb";
import { useAuth } from "../hooks/useAuth";
import {
  deleteRatingLogic,
  newRatingLogic,
  updateRatingLogic,
} from "../logic/ratingLogic";
import { getRatingRequest } from "../api/rating";
import { getGameRequest } from "../api/game";
import { ModalWindow } from "../components/ModalWindow,";
import {
  addGameToLikeList,
  checkIfGameIsLiked,
  deleteGameToLikeList,
} from "../logic/listLogic";
import { Loading } from "../components/Loading";
import { SearchBar } from "../components/SearchBar";
import { Footer } from "../components/Footer";

export default function GameDetailPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [gameDetails, setGameDetails] = useState([]);
  const [rating, setRating] = useState(0);
  const [rated, setRated] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  // Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
        const game = await getGameRequest(id, token);
        if (game) {
          const like = await checkIfGameIsLiked(game.game[0].id, token);
          setIsFavorite(like);
          const rating = await getRatingRequest(game.game[0].id, token);
          setRating(rating);
          setRated(true);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchDetails();
    fetchRating();
  }, [id, token]);

  useEffect(() => {
    setIsFavorite(false);
    setRated(false);
    setRating(0);
  }, [id]);

  const handleAddToFav = async () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      await addGameToLikeList(token, gameDetails, id);
    } else {
      await deleteGameToLikeList(token, id);
    }
  };

  const handleRatingChange = async (value) => {
    try {
      if (value === rating) {
        setRating(0);
        await deleteRatingLogic(id, token);
        setRated(false);
      } else {
        setRating(value);
        if (rated) {
          await updateRatingLogic(id, value, token);
        } else {
          await newRatingLogic(id, token, gameDetails, value);
        }
      }
    } catch (error) {
      console.error("Error al manejar el cambio de calificación:", error);
    }
  };

  const handleAddList = () => {
    handleShow();
  };

  const renderStars = () => {
    const stars = [];
    const maxRating = 5;
    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => handleRatingChange(i)}
          className={
            rated
              ? i <= rating
                ? "bi bi-star-fill rated"
                : "bi bi-star rated"
              : i <= rating
              ? "bi bi-star-fill"
              : "bi bi-star"
          }
        />
      );
    }
    return stars;
  };

  if (gameDetails.length === 0) {
    return <Loading />;
  }

  return (
    <>
      <Header isLogged={true} />
      <section className="logged-container-section">
        <div style={{ paddingTop: "1rem" }}>
          <SearchBar />
        </div>
      </section>
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
            <button className="detail-addList-button" onClick={handleAddList}>
              Añadir a lista
            </button>
            <ModalWindow
              show={show}
              handleClose={handleClose}
              gameName={gameDetails.name}
              igdb_id={id}
              gameDetails={gameDetails}
              onAddToLikeList={() => setIsFavorite(true)}
            />
          </div>
          <div className="detail-container-left">
            <div className="detail-container-info">
              <div className="detail-container-title">
                <h1 className="detail-title">{gameDetails.name}</h1>
                <h3 className="detail-subtitle">
                  {gameDetails.involved_companies && gameDetails.involved_companies
                    .map((company) => company.company.name)
                    .filter((name) => name)
                    .join(", ")}
                </h3>
              </div>
              <div className="details-heart">
                <i
                  className={isFavorite ? "bi bi-heart-fill" : "bi bi-heart"}
                  onClick={handleAddToFav}
                ></i>
              </div>
            </div>
            <p className="detail-gender">
              <span className="detail-bold">Género: </span>
              {gameDetails.genres &&
                gameDetails.genres.map((genre) => genre.name).filter((name) => name).join(", ")}
            </p>
            <p className="detail-platforms">
              <span className="detail-bold">Plataformas: </span>
              {gameDetails.platforms &&
                gameDetails.platforms
                  .map((platforms) => platforms.abbreviation)
                  .filter((abbreviation) => abbreviation)
                  .join(", ")}
            </p>
            <div className="detail-container-description-web">
              <h5 className="detail-title-description">Desripción</h5>
              <p className="detail-text-description">
                {gameDetails.summary && gameDetails.summary}
              </p>
            </div>
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
      <Footer />
    </>
  );
}
