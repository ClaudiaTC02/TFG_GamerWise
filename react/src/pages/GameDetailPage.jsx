import { useParams, useNavigate } from "react-router-dom";
import { CarouselSection } from "../components/CarouselSection";
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
import { Footer } from "../components/Footer";
import { getGameRecommendationsLogic } from "../logic/recommendationsLogic";

export default function GameDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [gameDetails, setGameDetails] = useState([]);
  const [recommendationsGame, setRecommendationsGame] = useState([]);
  const [rating, setRating] = useState(0);
  const [rated, setRated] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const game = await getGameDetailsRequest(id);
        if (game.length > 0) {
          setGameDetails(game[0]);
          const company =
            (game[0].involved_companies &&
              game[0].involved_companies.map((c) => c.company.name).join(", ")) ||
            "anonymus";
          const platforms =
            (game[0].platforms &&
              game[0].platforms.map((p) => p.abbreviation).join(", ")) ||
            "none";
          const genres =
            (game[0].genres && game[0].genres.map((g) => g.name).join(", ")) ||
            "none";
          const recommendations = await getGameRecommendationsLogic(
            token, id, game[0].name, company, genres, platforms
          );
          setRecommendationsGame(recommendations);
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
          const r = await getRatingRequest(game.game[0].id, token);
          setRating(r);
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

  const handleAddList = () => handleShow();

  const renderStars = () =>
    Array.from({ length: 5 }, (_, i) => i + 1).map((i) => (
      <span
        key={i}
        onClick={() => handleRatingChange(i)}
        className={
          rated
            ? i <= rating ? "bi bi-star-fill rated" : "bi bi-star rated"
            : i <= rating ? "bi bi-star-fill" : "bi bi-star"
        }
      />
    ));

  const getHeroBackground = () => {
    if (gameDetails.artworks?.length > 0)
      return gameDetails.artworks[0].url.replace("t_thumb", "t_1080p");
    if (gameDetails.screenshots?.length > 0)
      return gameDetails.screenshots[0].url.replace("t_thumb", "t_1080p");
    return null;
  };

  const heroBackground = getHeroBackground();

  const releaseDate = gameDetails.first_release_date
    ? new Date(gameDetails.first_release_date * 1000).toLocaleDateString("es-ES", {
        year: "numeric", month: "short", day: "numeric",
      })
    : null;

  if (gameDetails.length === 0) return <Loading />;

  /* ── Bloques reutilizables ── */
  const MetaChips = () => (
    <div className="gd-meta-chips">
      {releaseDate && (
        <div className="gd-chip">
          <i className="bi bi-calendar3" />
          <div>
            <span className="gd-chip-label">Lanzamiento</span>
            <span className="gd-chip-val">{releaseDate}</span>
          </div>
        </div>
      )}
      {gameDetails.platforms && (
        <div className="gd-chip">
          <i className="bi bi-controller" />
          <div>
            <span className="gd-chip-label">Plataformas</span>
            <span className="gd-chip-val">
              {gameDetails.platforms.map((p) => p.abbreviation).filter(Boolean).join(" · ")}
            </span>
          </div>
        </div>
      )}
      {gameDetails.involved_companies && (
        <div className="gd-chip">
          <i className="bi bi-building" />
          <div>
            <span className="gd-chip-label">Desarrolladora</span>
            <span className="gd-chip-val">
              {gameDetails.involved_companies.map((c) => c.company.name).filter(Boolean)[0]}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Header isLogged={true} />

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <section className="gd-hero">
        <div className="gd-hero-bg">
          {heroBackground && (
            <img src={heroBackground} alt="" className="gd-hero-art" />
          )}
          <div className="gd-hero-grad" />
        </div>

        <div className="gd-hero-topbar">
          <button className="gd-back-btn" onClick={() => navigate(-1)} aria-label="Volver">
            <i className="bi bi-arrow-left" />
          </button>
        </div>

        {/* Desktop hero: dos filas */}
        <div className="gd-hero-content">

          {/* Fila 1: portada flotante + título */}
          <div className="gd-hero-row1">
            <div className="gd-cover-wrap">
              <img
                className="gd-cover-img"
                src={
                  gameDetails.cover
                    ? gameDetails.cover.url.replace("t_thumb", "t_cover_big")
                    : defaultCoverIcon()
                }
                alt={gameDetails.name}
              />
            </div>
            <div className="gd-hero-title-block">
              {gameDetails.involved_companies && (
                <p className="gd-studio">
                  {gameDetails.involved_companies
                    .map((c) => c.company.name).filter(Boolean).join(" · ")}
                </p>
              )}
              <h1 className="gd-title">{gameDetails.name}</h1>
              <div className="gd-tags">
                {gameDetails.genres &&
                  gameDetails.genres.map((g) => g.name).filter(Boolean).map((name, i) => (
                    <span key={i} className="gd-tag">{name}</span>
                  ))}
              </div>
            </div>
          </div>

          {/* Fila 2: meta chips a la izq, estrellas + botones a la dcha */}
          <div className="gd-hero-row2">
            <MetaChips />

            <div className="gd-hero-actions-group">
              <div className="gd-stars-inline">
                <span className="gd-chip-label">Tu puntuación</span>
                <div className="gd-stars">{renderStars()}</div>
              </div>
              <div className="gd-bar-div" />
              <button className="gd-btn-add" onClick={handleAddList}>
                <i className="bi bi-plus-lg" /> Añadir a mis listas
              </button>
              <button
                className={`gd-btn-fav${isFavorite ? " is-fav" : ""}`}
                onClick={handleAddToFav}
                aria-label={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
              >
                <i className={isFavorite ? "bi bi-heart-fill" : "bi bi-heart"} />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════
          MÓVIL: zona oscura + card blanca
      ══════════════════════════════════ */}
      <div className="gd-mobile-only">
        <div className="gd-mob-title-area">
          {gameDetails.involved_companies && (
            <p className="gd-mob-studio">
              {gameDetails.involved_companies.map((c) => c.company.name).filter(Boolean).join(" · ")}
            </p>
          )}
          <h1 className="gd-mob-title">{gameDetails.name}</h1>
          <div className="gd-tags">
            {gameDetails.genres &&
              gameDetails.genres.map((g) => g.name).filter(Boolean).map((name, i) => (
                <span key={i} className="gd-tag">{name}</span>
              ))}
          </div>
        </div>

        <div className="gd-mob-card">
          <div className="gd-mob-stars-row">
            <span className="gd-mob-stars-label">Tu puntuación</span>
            <div className="gd-stars">{renderStars()}</div>
          </div>

          <button className="gd-btn-add gd-btn-full" onClick={handleAddList}>
            <i className="bi bi-plus-lg" /> Añadir a mis listas
          </button>
          <button
            className={`gd-mob-fav-btn${isFavorite ? " is-fav" : ""}`}
            onClick={handleAddToFav}
          >
            <i className={isFavorite ? "bi bi-heart-fill" : "bi bi-heart"} />
            {isFavorite ? "Guardado en favoritos" : "Guardar en favoritos"}
          </button>

          <div className="gd-mob-meta">
            {releaseDate && (
              <div className="gd-mob-meta-item">
                <i className="bi bi-calendar3" />
                <div>
                  <span className="gd-mob-meta-label">Lanzamiento</span>
                  <span className="gd-mob-meta-val">{releaseDate}</span>
                </div>
              </div>
            )}
            {gameDetails.platforms && (
              <div className="gd-mob-meta-item">
                <i className="bi bi-controller" />
                <div>
                  <span className="gd-mob-meta-label">Plataformas</span>
                  <span className="gd-mob-meta-val">
                    {gameDetails.platforms.map((p) => p.abbreviation).filter(Boolean).join(", ")}
                  </span>
                </div>
              </div>
            )}
            {gameDetails.involved_companies && (
              <div className="gd-mob-meta-item">
                <i className="bi bi-building" />
                <div>
                  <span className="gd-mob-meta-label">Desarrolladora</span>
                  <span className="gd-mob-meta-val">
                    {gameDetails.involved_companies.map((c) => c.company.name).filter(Boolean)[0]}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="gd-mob-section">
            <h2 className="gd-sec-label">Descripción</h2>
            <p className="gd-desc-text">
              {gameDetails.summary ?? "No hay descripción disponible para este título."}
            </p>
          </div>

          {gameDetails.genres && (
            <div className="gd-mob-section">
              <h2 className="gd-sec-label">Géneros</h2>
              <div className="gd-badges">
                {gameDetails.genres.map((g) => g.name).filter(Boolean).map((name, i) => (
                  <span key={i} className="gd-badge gd-badge--genre">{name}</span>
                ))}
              </div>
            </div>
          )}

          {gameDetails.platforms && (
            <div className="gd-mob-section">
              <h2 className="gd-sec-label">Plataformas</h2>
              <div className="gd-badges">
                {gameDetails.platforms.map((p) => p.abbreviation).filter(Boolean).map((abbr, i) => (
                  <span key={i} className="gd-badge gd-badge--platform">{abbr}</span>
                ))}
              </div>
            </div>
          )}

          {recommendationsGame?.length > 0 && (
            <div className="gd-mob-section">
              <CarouselSection gamesData={recommendationsGame} text="También puede gustarte" />
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════
          DESKTOP: body
      ══════════════════════════════════ */}
      <div className="gd-desktop-only">
        <div className="gd-desktop-body">
          <div className="gd-desktop-grid">
            <main className="gd-desktop-main">
              <h2 className="gd-sec-label">Descripción</h2>
              <p className="gd-desc-text">
                {gameDetails.summary ?? "No hay descripción disponible para este título."}
              </p>
            </main>
            <aside className="gd-desktop-aside">
              {gameDetails.genres && (
                <div className="gd-aside-sec">
                  <h2 className="gd-sec-label">Géneros</h2>
                  <div className="gd-badges">
                    {gameDetails.genres.map((g) => g.name).filter(Boolean).map((name, i) => (
                      <span key={i} className="gd-badge gd-badge--genre">{name}</span>
                    ))}
                  </div>
                </div>
              )}
              {gameDetails.platforms && (
                <div className="gd-aside-sec">
                  <h2 className="gd-sec-label">Plataformas</h2>
                  <div className="gd-badges">
                    {gameDetails.platforms.map((p) => p.abbreviation).filter(Boolean).map((abbr, i) => (
                      <span key={i} className="gd-badge gd-badge--platform">{abbr}</span>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>

          {recommendationsGame?.length > 0 && (
            <div className="gd-desktop-recs">
              <CarouselSection gamesData={recommendationsGame} text="También puede gustarte" />
            </div>
          )}
        </div>
      </div>

      <ModalWindow
        show={show}
        handleClose={handleClose}
        gameName={gameDetails.name}
        igdb_id={id}
        gameDetails={gameDetails}
        onAddToLikeList={() => setIsFavorite(true)}
      />

      <Footer />
    </>
  );
}
