// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// import translations
import registerEN from "./locales/en/register.json";
import headerEN from "./locales/en/header.json";
import headerES from "./locales/es/header.json";
import registerES from "./locales/es/register.json";

// configure
i18n.use(initReactI18next).init({
  resources: {
    en: {
      register: registerEN,
      header: headerEN,
    },
    es: {
      register: registerES,
      header: headerES,
    },
  },
  lng: navigator.language,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
