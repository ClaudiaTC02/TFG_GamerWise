import { defaultCoverIcon, quitIcon, starFillIcon } from "./Icons";
import "../styles/ListGame.css";
export function ListGame({game}) {
  return (
    <div className="listgame-border">
      <div>
        <img
          alt={game.name}
          src={game.cover ? game.cover.replace("t_thumb", "t_cover_big") : defaultCoverIcon()}
          className="listgame-game-img"
        ></img>
        <div className="listgame-info-container">
          <div className="listgame-rating-container">
            <p className="listgame-rating-img">{starFillIcon()}</p>
            <p className="listgame-rating">{game.rating}</p>
          </div>
          <button className="listgame-button">{quitIcon()}</button>
        </div>
      </div>
    </div>
  );
}
