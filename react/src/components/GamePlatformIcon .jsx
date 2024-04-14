import {
  nintendoIcon,
  pcIcon,
  playstationIcon,
  xboxIcon,
  androidIcon,
  iosIcon,
} from "./Icons";
export function GamePlatformIcon({ platform }) {
  let iconSrc = "";

  switch (platform) {
    case "Nintendo":
      iconSrc = nintendoIcon();
      break;
    case "PC":
      iconSrc = pcIcon();
      break;
    case "Playstation":
      iconSrc = playstationIcon();
      break;
    case "Xbox":
      iconSrc = xboxIcon();
      break;
    case "Android":
      iconSrc = androidIcon();
      break;
    case "iOS":
      iconSrc = iosIcon();
      break;
    default:
      break;
  }

  return <img className="platform" src={iconSrc} alt={platform} />;
}
