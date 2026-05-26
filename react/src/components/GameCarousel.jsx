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
      if (!platform || !platform.abbreviation) return; 
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

const MAX_CONTAINER_WIDTH = 140;
const ICON_WIDTH = 30;
const TEXT_BADGE_WIDTH = 80;
const MORE_BADGE_WIDTH = 40;

const platformEntries = Object.entries(groupedPlatforms);
const totalGroups = platformEntries.length;

let visiblePlatforms = [];
let hiddenPlatforms = [];
let currentWidth = 0;


for (let i = 0; i < totalGroups; i++) {
  const [groupName, specificPlatforms] = platformEntries[i];
  const isIcon = ["Nintendo", "PC", "PlayStation", "Xbox", "Android", "iOS", "VR"].includes(groupName);
  const elementWidth = isIcon ? ICON_WIDTH : TEXT_BADGE_WIDTH;
  const isLastElement = i === totalGroups - 1;
  const requiredSpace = currentWidth + elementWidth + (isLastElement ? 0 : MORE_BADGE_WIDTH);

  if (requiredSpace <= MAX_CONTAINER_WIDTH) {
    visiblePlatforms.push(platformEntries[i]);
    currentWidth += elementWidth;
  } else {
    hiddenPlatforms = platformEntries.slice(i);
    break;
  }
}

const numHiddenGroups = hiddenPlatforms.length;
let hiddenPlatformsText = "";
if (numHiddenGroups > 0) {
  hiddenPlatformsText = hiddenPlatforms
    .flatMap(([_, specificPlatforms]) => specificPlatforms) 
    .join(", "); 
}

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
        {visiblePlatforms.map(([groupName, specificPlatforms], index) => (
          <GamePlatformIcon 
            key={index} 
            platform={groupName} 
            specificPlatforms={specificPlatforms} 
          />
        ))}

        {numHiddenGroups > 0 && (
          <span 
            className="platform-more-badge" 
            title={`Otras plataformas: ${hiddenPlatformsText}`}
          >
            +{numHiddenGroups}
          </span>
        )}
      </div>
    </div>
  </Link>
);
}