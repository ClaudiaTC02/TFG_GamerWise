import "../styles/GameCarousel.css";
import { GamePlatformIcon } from "./GamePlatformIcon ";
import { defaultCoverIcon } from "./Icons";
import moment from "moment";
import { Link } from "react-router-dom";

export function GameCarousel({ game }) {
  const platformMap = {
    PS4: "PlayStation",
    PS3: "PlayStation",
    PS5: "PlayStation",
    XONE: "Xbox",
    XBOX: 'Xbox',
    X360: "Xbox",
    "Series X": "Xbox",
    Switch: "Nintendo",
    "3DS": "Nintendo",
    Linux: "PC",
    Mac: "PC",
    Stadia: "PC",
    "Meta Quest 2": "VR",
    PSVR2: "VR",
    PSVR: "VR",
    PS1: 'PlayStation',
    "Steam VR": "VR",
    "Win Phone": "Android",
    "Oculus VR": "VR"
  };
  const uniquePlatforms = new Set();

  const mergedPlatforms = game.game.platforms.map((platform) => {
    return platformMap[platform.abbreviation] || platform.abbreviation;
  });

  mergedPlatforms.forEach((platform) => {
    uniquePlatforms.add(platform);
  });

  const date = moment.unix(game.game.first_release_date).format("DD/MM/YYYY");

  return (
    <Link to={`/game/${game.game.id}`} className="game-link" style={{'textDecoration': 'none', 'color': 'inherit'}}>
      <div className="game-container">
        <div className="info-game-container">
          <img
            className="game-img"
            src={game.game.cover ? game.game.cover.url.replace("t_thumb", "t_cover_big") : defaultCoverIcon()}
            alt={game.game.name}
          />
          <div>
            <h4 className="game-name">{game.game.name}</h4>
          </div>
          <p className="game-date">{date}</p>
        </div>
        <div className="game-platforms">
          {[...uniquePlatforms].map((platform, index) => (
            <GamePlatformIcon key={index} platform={platform} />
          ))}
        </div>
      </div>
    </Link>
  );
}
