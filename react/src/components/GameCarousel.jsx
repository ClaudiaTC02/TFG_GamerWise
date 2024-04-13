import { nintendoIcon, pcIcon, playstationIcon, xboxIcon } from "./Icons";
import "../styles/GameCarousel.css";

export function GameCarousel({url, name, platforms}) {
  return (
    <div className="game-container">
      <div className="info-game-container">
        <img
          className="game-img"
          src={url}
        />
        <h4 className="game-name">{name}</h4>
      </div>
      <div className="game-platforms">
        <img className="platform" src={nintendoIcon()} />
        <img className="platform" src={pcIcon()} />
        <img className="platform" src={playstationIcon()} />
        <img className="platform" src={xboxIcon()} />
      </div>
    </div>
  );
}
