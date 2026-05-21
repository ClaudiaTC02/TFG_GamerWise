import "../styles/GameCarousel.css";
import { GamePlatformIcon } from "./GamePlatformIcon"; 
import { defaultCoverIcon } from "./Icons";
import moment from "moment";
import { Link } from "react-router-dom";

export function GameCarousel({ game }) {
  const platformMap = {
    PS4: "PlayStation", PS3: "PlayStation", PS5: "PlayStation", PS1: "PlayStation", Vita: "PlayStation",
    XONE: "Xbox", XBOX: "Xbox", X360: "Xbox", "Series X": "Xbox", "Series X|S": "Xbox",
    Switch: "Nintendo", "3DS": "Nintendo", WiiU: "Nintendo", "Switch 2": "Nintendo",
    Linux: "PC", Mac: "PC", Stadia: "PC",
    "Meta Quest 2": "VR", PSVR2: "VR", PSVR: "VR", "Steam VR": "VR", "Oculus VR": "VR",
    "Win Phone": "Android"
  };

  const groupedPlatforms = {};

  if (game.game.platforms) {
    game.game.platforms.forEach((platform) => {
      const groupName = platformMap[platform.abbreviation] || platform.abbreviation;
      if (!groupedPlatforms[groupName]) {
        groupedPlatforms[groupName] = [];
      }
      if (!groupedPlatforms[groupName].includes(platform.abbreviation)) {
        groupedPlatforms[groupName].push(platform.abbreviation);
      }
    });
  }

  const date = game.game.first_release_date 
    ? moment.unix(game.game.first_release_date).format("DD/MM/YYYY") 
    : "TBA";

  return (
    <Link to={`/game/${game.game.id}`} className="game-link">
      <div className="game-container">
        <div className="info-game-container">
          <img
            className="game-img"
            src={game.game.cover ? game.game.cover.url.replace("t_thumb", "t_cover_big") : defaultCoverIcon()}
            alt={game.game.name}
          />
          <div className="game-name-container">
            <h4 className="game-name" title={game.game.name}>{game.game.name}</h4>
          </div>
          <p className="game-date">{date}</p>
        </div>
        
        <div className="game-platforms">
          {Object.entries(groupedPlatforms).map(([groupName, specificPlatforms], index) => (
            <GamePlatformIcon 
              key={index} 
              platform={groupName} 
              specificPlatforms={specificPlatforms} 
            />
          ))}
        </div>
      </div>
    </Link>
  );
}