import "../styles/FormInput.css";

import { useState, useEffect } from "react";
import {
  eyeIcon,
  eyeSlashIcon,
} from "./Icons.jsx";
import { getIcon, getValidationRules } from "../utils/formUtils.js";

export function FormInput({ children, type, name, register, errors, isSubmitted, passwordValue, noIcon }) {
  const [visibility, setVisibility] = useState(false);
  const [inputType, setInputType] = useState(type);

  useEffect(() => {
    setInputType(visibility ? "text" : "password");
  }, [visibility]);

  const handleShowHide = () => {
    setVisibility(!visibility);
  };

  const validationRules = getValidationRules(name, passwordValue);
  let icon = getIcon(type);
  if(noIcon){
    icon=null
  }

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