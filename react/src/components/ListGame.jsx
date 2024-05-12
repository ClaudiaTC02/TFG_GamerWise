import { defaultCoverIcon, quitIcon, starFillIcon } from "./Icons";
import "../styles/ListGame.css";
import { deleteGameFromListRequest } from "../api/list";
import { useAuth } from "../hooks/useAuth";
export function ListGame({ game, list_id, updateGameList }) {
  const { token } = useAuth();

  const handleDeleteFromList = async (event) => {
    event.preventDefault();
    try {
      await deleteGameFromListRequest(list_id, game.id, token);
      updateGameList(game.id);
    } catch (error) {
      console.log("No se pudo borrar el juego");
    }
  };

  return (
    <div className="listgame-border">
      <div>
        <img
          alt={game.name}
          src={
            game.cover
              ? game.cover.replace("t_thumb", "t_cover_big")
              : defaultCoverIcon()
          }
          className="listgame-game-img"
        ></img>
        <div className="listgame-info-container">
          <div className="listgame-rating-container">
            <p className="listgame-rating-img">{starFillIcon()}</p>
            <p className="listgame-rating">{game.rating}</p>
          </div>
          <button className="listgame-button" onClick={handleDeleteFromList}>
            {quitIcon()}
          </button>
        </div>
      </div>
    </div>
  );
}
