import {
    userIcon,
    emailIcon,
    passwordIcon,
  } from "../components/Icons.jsx";

export function getValidationRules(name, passwordValue) {
    switch (name) {
      case "name":
        return { required: "Username is required", minLength: { value: 6, message: "Username must be at least 6 characters" } };
      case "email":
        return { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" } };
      case "password":
        return {
          required: "Password is required",
          minLength: { value: 8, message: "Password must be at least 8 characters" },
          validate: {
            uppercase: value => /[A-Z]/.test(value) || "Password must contain at least one uppercase letter",
            lowercase: value => /[a-z]/.test(value) || "Password must contain at least one lowercase letter",
            symbol: value => /[!@#$%^&*(),.?":{}|<>]/.test(value) || "Password must contain at least one symbol"
          }
        };
      case "password-repeat":
        return { required: "Please repeat your password", validate: value => value === passwordValue || "Passwords do not match" };
      default:
        return {};
    }
  }
  
export function getIcon(type) {
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
  }