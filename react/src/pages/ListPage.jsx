import { Link, useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { deleteIcon, editIcon } from "../components/Icons";
import { ListGame } from "../components/ListGame";
import { CarouselSection } from "../components/CarouselSection";
import "../styles/ListPage.css";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { getGamesOfListWithRatingLogic } from "../logic/listLogic";
import { ModalDeleteList, ModalUpdateList } from "../components/ModalLists";
import { Loading } from "../components/Loading";
import { Footer } from "../components/Footer";
import { getListRecommendationsLogic } from "../logic/recommendationsLogic";
import moment from "moment";

export function ListPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [list, setList] = useState([]);
  const [games, setGames] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showList, setShowList] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleCloseList = () => setShowList(false);
  const handleShowList = () => setShowList(true);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);

  useEffect(() => {
    const fetchListDetails = async () => {
      try {
        const list_result = await getGamesOfListWithRatingLogic(id, token);
        const recs = await getListRecommendationsLogic(token, id);
        setRecommendations(recs);
        setLoading(false);
        if (list_result) {
          setList(list_result.list);
          setGames(list_result.games);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchListDetails();
  }, [id, token]);

  const forbiddenNames = ["Playing", "Completed", "Like", "Dropped"];

  const handleClick = (event) => {
    event.preventDefault();
    navigate("/profile#lists");
  };

  const handleUpdateList = (updatedList) => setList(updatedList);
  const updateGameList = (gameIdToDelete) => {
    setGames((prev) => prev.filter((game) => game.id !== gameIdToDelete));
  };

  if (loading) return <Loading />;

  const canEdit = !forbiddenNames.includes(list.name);
  const hasRecs = Array.isArray(recommendations) && recommendations.length > 0;

  return (
    <div className="list-page-wrapper">
      <Header isLogged={true} />

      {/* ── Hero mobile ── */}
      <div className="list-mobile-hero">
        <a className="list-back-arrow" onClick={handleClick}>
          ←
        </a>
        <div className="list-mobile-hero-text">
          <h1>{list.name}</h1>
          {list.description && list.description !== "null" && (
            <p>{list.description}</p>
          )}
        </div>
        {canEdit && (
          <div className="list-mobile-edit">
            <a
              className="list-edit-options edit"
              onClick={(e) => {
                e.preventDefault();
                handleShowList();
              }}
            >
              {editIcon()}
            </a>
            <a
              className="list-edit-options delete"
              onClick={(e) => {
                e.preventDefault();
                handleShowDelete();
              }}
            >
              {deleteIcon()}
            </a>
          </div>
        )}
      </div>

      <div className="list-content-area">
        <div className="list-main-col">
          <div className="list-header">
            <div className="list-title-row">
              <div className="list-title-left">
                <a
                  className="list-back"
                  onClick={handleClick}
                  title="Volver al perfil"
                >
                  ←
                </a>
                <div>
                  <h1 className="list-title">{list.name}</h1>
                  <span className="list-accent" />
                  {list.description && list.description !== "null" && (
                    <p className="list-description">{list.description}</p>
                  )}
                </div>
              </div>
              {canEdit && (
                <div className="list-edit-container">
                  <a
                    className="list-edit-options edit"
                    onClick={(e) => {
                      e.preventDefault();
                      handleShowList();
                    }}
                    title="Editar lista"
                  >
                    {editIcon()}
                  </a>
                  <a
                    className="list-edit-options delete"
                    onClick={(e) => {
                      e.preventDefault();
                      handleShowDelete();
                    }}
                    title="Eliminar lista"
                  >
                    {deleteIcon()}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="list-games-panel">
            {games.length > 0 ? (
              <main className="list-games-container">
                {games.map((game) => (
                  <ListGame
                    key={game.id}
                    game={game}
                    list_id={id}
                    updateGameList={updateGameList}
                  />
                ))}
              </main>
            ) : (
              <p className="no-games-list">No hay juegos en esta lista</p>
            )}
          </div>

          {/* Carrusel mobile */}
          {hasRecs && (
            <div className="list-recs-mobile">
              <CarouselSection
                gamesData={recommendations}
                text="Podrías incluir"
              />
            </div>
          )}
        </div>

        {/* ── Sidebar desktop ── */}
        {hasRecs && (
          <aside className="list-sidebar">
            <div className="list-sidebar-sticky">
              <div className="list-sidebar-header">Recomendaciones</div>
              <div className="list-recs-list">
                {recommendations.map((element) => {
                  const game = element.game;
                  const coverUrl = game.cover
                    ? game.cover.url.replace("t_thumb", "t_cover_big")
                    : "";
                  const releaseDate = game.first_release_date
                    ? moment.unix(game.first_release_date).format("YYYY")
                    : null;
                  return (
                    <Link
                      key={element.id}
                      to={`/game/${game.id}`}
                      className="rec-card-v"
                    >
                      <img
                        src={coverUrl}
                        alt={game.name}
                        className="rec-card-v-img"
                      />
                      <div className="rec-card-v-info">
                        <span className="rec-card-v-name">{game.name}</span>
                        {releaseDate && (
                          <span className="rec-card-v-date">{releaseDate}</span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        )}
      </div>

      <ModalUpdateList
        show={showList}
        handleClose={handleCloseList}
        token={token}
        list={list}
        updateList={handleUpdateList}
      />
      <ModalDeleteList
        show={showDelete}
        handleClose={handleCloseDelete}
        token={token}
        list={list}
      />
      <Footer />
    </div>
  );
}
