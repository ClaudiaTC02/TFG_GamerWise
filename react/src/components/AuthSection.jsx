import { Link } from "react-router-dom";
import "../styles/AuthSection.css";
import { Header } from "./Header";
import { steamIcon } from "./Icons";

export function AuthSection({ texts, onSubmit, children, error, actionRoute }) {
  return (
    <section>
      <Header />
      <div className="auth-container">
        <h1>
          ¡<span className="highlited-text">{texts.highlited}</span>{" "}
          {texts.title}
        </h1>
        <p className="subtitle">{texts.subtitle}</p>
        <hr className="hr-auth" />
        <form onSubmit={onSubmit}>
          {children}
          <button type="submit" className="button-form">
            {texts.buttonText}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
        <div className="steam-container">
          <p className="steam-paragraph">{texts.steamText}</p>
          <button className="steam-register">
            <span>{steamIcon()}</span>
          </button>
        </div>
        <p className="final-paragraph">
          {texts.questionText}{" "}
          <Link to={actionRoute} className="highlited-text">{texts.actionText}</Link>
        </p>
      </div>
    </section>
  );
}
