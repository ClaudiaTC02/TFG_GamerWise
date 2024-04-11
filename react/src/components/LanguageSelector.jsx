import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function LanguageSelector() {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("language") || navigator.language.substring(0, 2)
  );

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [i18n, selectedLanguage]);

  const handleChangeLanguage = (e) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  return (
    <select value={selectedLanguage} onChange={handleChangeLanguage}>
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  );
}

export default LanguageSelector;
