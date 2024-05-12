import { quitIcon, starFillIcon } from "./Icons";
import "../styles/ListGame.css";
export function ListGame() {
  return (
    <div className="listgame-border">
      <div>
        <img
          alt="Juego"
          src="http://images.igdb.com/igdb/image/upload/t_cover_big/co7tjw.jpg"
          className="listgame-game-img"
        ></img>
        <div className="listgame-info-container">
          <div className="listgame-rating-container">
            <p className="listgame-rating-img">{starFillIcon()}</p>
            <p className="listgame-rating">5</p>
          </div>
          <button className="listgame-button">{quitIcon()}</button>
        </div>
      </div>
    </div>
  );
}
