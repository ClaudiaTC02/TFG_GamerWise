import "../styles/RegisterPage.css";
import { FormInput } from "../components/FormInput";
import { Header } from "../components/Header";
import { steamIcon } from "../components/Icons";

export default function RegisterPage() {
  return (
    <section>
      <Header />
      <div className="register-container">
        <h1>
          ¡<span className="highlited-text">Únete</span> a GamerWise!
        </h1>
        <p className="subtitle">Empezamos una nueva partida juntos</p>
        <hr />
        <form>
          <FormInput type="text">User</FormInput>
          <FormInput type="email">Email</FormInput>
          <FormInput type="password">Password</FormInput>
          <FormInput type="password">Repeat the password</FormInput>
          <button className="button-form">Register</button>
        </form>
        <div className="steam-container">
          <p className="steam-paragraph">o Regístrate con</p>
          <button className="steam-register">
            <span>{steamIcon()}</span>
          </button>
        </div>
        <p className="login-paragraph">
          ¿Ya tienes cuenta? <a className="highlited-text">INICIA SESIÓN</a>
        </p>
      </div>
    </section>
  );
}
