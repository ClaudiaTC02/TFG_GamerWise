import "../styles/GameCarousel.css";
import { GamePlatformIcon } from "./GamePlatformIcon ";
import { defaultCoverIcon } from "./Icons";

export function GameCarousel({ game }) {
  const platformMap = {
    PS4: "PlayStation",
    PS5: "PlayStation",
    XONE: "Xbox",
    "Series X": "Xbox",
    Switch: "Nintendo",
    Linux: 'PC',
    Mac : 'PC',
    "Meta Quest 2": 'VR',
    PSVR2: 'VR'
  };
  const uniquePlatforms = new Set();

  const mergedPlatforms = game.game.platforms.map((platform) => {
    return platformMap[platform.abbreviation] || platform.abbreviation;
  });


  mergedPlatforms.forEach((platform) => {
    uniquePlatforms.add(platform);
  });

  return (
    <div className="game-container">
      <div className="info-game-container">
        <img
          className="game-img"
          src={game.game.cover ? game.game.cover.url : defaultCoverIcon()}
          alt={game.game.name}
        />
        <h4 className="game-name">{game.game.name}</h4>
      </div>
      <div className="game-platforms">
        {[...uniquePlatforms].map((platform) => (
          <GamePlatformIcon key={platform} platform={platform} />
        ))}
      </div>
    </div>
  );
}
