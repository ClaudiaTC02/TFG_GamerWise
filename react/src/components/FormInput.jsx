import "../styles/FormInput.css";

import { useState, useEffect } from "react";
import {
  userIcon,
  emailIcon,
  passwordIcon,
  eyeIcon,
  eyeSlashIcon,
} from "./Icons.jsx";

export function FormInput({ children, type, name, register, errors, isSubmitted, passwordValue }) {
  const [visibility, setVisibility] = useState(false);
  const [inputType, setInputType] = useState(type);

  useEffect(() => {
    setInputType(visibility ? "text" : "password");
  }, [visibility]);


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

  let validationRules = {};
  switch (name) {
    case "name":
      validationRules = { required: "Username is required", minLength: { value: 6, message: "Username must be at least 6 characters" } };
      break;
    case "email":
      validationRules = { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" } };
      break;
    case "password":
      validationRules = { 
        required: "Password is required", 
        minLength: { value: 8, message: "Password must be at least 8 characters" },
        validate: {
          uppercase: value => /[A-Z]/.test(value) || "Password must contain at least one uppercase letter",
          lowercase: value => /[a-z]/.test(value) || "Password must contain at least one lowercase letter",
          symbol: value => /[!@#$%^&*(),.?":{}|<>]/.test(value) || "Password must contain at least one symbol"
        }
      };
      break;
    case "password-repeat":
      validationRules = { 
        required: "Please repeat your password",
        validate: value => value === passwordValue || "Passwords do not match"
      };
      break;
    default:
      break;
  }

  const handleShowHide = () => {
    setVisibility(!visibility);
  };

  const icon = getIcon();

  return (
    <div className="input-container">
      <div className="input-wrapper">
        {icon && <img className="icon" src={icon} alt={`icon of ${icon}`} />}
        <input placeholder={children} type={type === "password" ? inputType : type} {...register(name, validationRules)} />
        {type === "password" && (
          <a onClick={handleShowHide}>
            <span className="visibility-icon">{visibility ? eyeSlashIcon() : eyeIcon()}</span>
          </a>
        )}
      </div>
        {isSubmitted && errors && errors[name] ? <p className="error-paragraph">{errors[name].message}</p> : <></>}
    </div>
  );
}
