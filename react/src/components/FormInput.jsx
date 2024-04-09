import "../styles/FormInput.css";

import { useState } from "react";
import {
  userIcon,
  emailIcon,
  passwordIcon,
  eyeIcon,
  eyeSlashIcon,
} from "./Icons.jsx";

export function FormInput({ children, type }) {
  const [visibility, setVisibility] = useState(false);

  const getIcon = () => {
    switch (type) {
      case "text":
        return userIcon();
      case "email":
        return emailIcon();
      case "password":
        return passwordIcon();
      default:
        return null;
    }
  };

  const handleShowHide = () => {
    setVisibility(!visibility);
  };

  const icon = getIcon();
  console.log(icon);

  return (
    <div className="input-container">
      <div className="input-wrapper">
        {icon && <img className="icon" src={icon} alt={`icon of ${icon}`} />}
        <input placeholder={children} type={type} />
        {type === "password" && (
          <a onClick={handleShowHide}>
            <span className="visibility-icon">{visibility ? eyeSlashIcon() : eyeIcon()}</span>
          </a>
        )}
      </div>
    </div>
  );
}
