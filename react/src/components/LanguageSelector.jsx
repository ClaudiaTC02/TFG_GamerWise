import { useLanguage } from "../hooks/useLanguage";

function LanguageSelector() {
    const { language, setLanguage } = useLanguage()

  const handleChangeLanguage = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
  };

  return (
    <select className="form-select" style={{display: 'inline', width: 'fit-content', margin: '0 1rem 0 0'}} value={language} onChange={handleChangeLanguage}>
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  );
}

export default LanguageSelector;
