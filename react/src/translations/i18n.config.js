// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// import translations
import registerEN from "./locales/en/register.json";
import registerES from "./locales/es/register.json";

// configure
i18n.use(initReactI18next).init({
  resources: {
    en: {
      register: registerEN,
    },
    es: {
      register: registerES,
    },
  },
  lng: navigator.language,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
