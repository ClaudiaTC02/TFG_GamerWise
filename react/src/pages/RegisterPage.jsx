import "../styles/RegisterPage.css";
import { FormInput } from "../components/FormInput";
import { Header } from "../components/Header";
import { steamIcon } from "../components/Icons";

import { useForm } from "react-hook-form";

export default function RegisterPage() {
  const { register, handleSubmit,watch, formState: { errors, isSubmitted } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  }

  return (
    <section>
      <Header />
      <div className="register-container">
        <h1>
          ¡<span className="highlited-text">Únete</span> a GamerWise!
        </h1>
        <p className="subtitle">Empezamos una nueva partida juntos</p>
        <hr />
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput type="text" name="name" register={register} errors={errors} isSubmitted={isSubmitted}>Username</FormInput>
          <FormInput type="email" name="email" register={register} errors={errors} isSubmitted={isSubmitted}>Email</FormInput>
          <FormInput type="password" name="password" register={register} errors={errors} isSubmitted={isSubmitted}>Password</FormInput>
          <FormInput type="password" name="password-repeat" register={register} errors={errors} isSubmitted={isSubmitted} passwordValue={watch("password")}>Repeat the password</FormInput>
          <button type="submit" className="button-form">Register</button>
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
