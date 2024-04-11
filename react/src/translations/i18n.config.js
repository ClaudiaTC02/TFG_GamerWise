// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// import translations english
import registerEN from "./locales/en/register.json";
import headerEN from "./locales/en/header.json";
import loginEN from "./locales/en/login.json";

// import translations spanish
import headerES from "./locales/es/header.json";
import registerES from "./locales/es/register.json";
import loginES from "./locales/es/login.json";

// configure
i18n.use(initReactI18next).init({
  resources: {
    en: {
      register: registerEN,
      header: headerEN,
      login: loginEN,
    },
    es: {
      register: registerES,
      header: headerES,
      login: loginES,
    },
  },
  lng: navigator.language,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
