import {
  nintendoIcon,
  pcIcon,
  playstationIcon,
  xboxIcon,
  androidIcon,
  iosIcon,
  vrIcon,
} from "./Icons";

export function GamePlatformIcon({ platform, specificPlatforms }) {
  let iconSrc = "";

  switch (platform) {
    case "Nintendo": iconSrc = nintendoIcon(); break;
    case "PC": iconSrc = pcIcon(); break;
    case "PlayStation": iconSrc = playstationIcon(); break;
    case "Xbox": iconSrc = xboxIcon(); break;
    case "Android": iconSrc = androidIcon(); break;
    case "iOS": iconSrc = iosIcon(); break;
    case "VR": iconSrc = vrIcon(); break;
    default: break;
  }

  const hoverText = specificPlatforms && specificPlatforms.length > 0 
    ? specificPlatforms.join(", ") 
    : platform;

  if (iconSrc) {
    return (
      <img 
        className="platform-icon" 
        src={iconSrc} 
        alt={platform} 
        title={hoverText}
      />
    );
  }

  return (
    <span className="platform-badge" title={hoverText}>
      {platform}
    </span>
  );
}