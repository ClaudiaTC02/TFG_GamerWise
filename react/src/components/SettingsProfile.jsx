import { useForm } from "react-hook-form";
import { FormInput } from "./FormInput";
import "../styles/SettingsProfile.css";
import { updateNameRequest } from "../api/user";
import { useAuth } from "../hooks/useAuth";

export function SettingsProfile({updateUser}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm();

  const { token } = useAuth();

  const onSubmit = async (data) => {
    try {
      await updateNameRequest(data.name, token);
      updateUser(data.name);
    } catch (error) {
        console.log(error.message);
    }
  };
  return (
    <section className="settings-section">
      <div className="settings-main-container">
        <div className="settings-container-left">
          <h4 className="settings-title">Perfil</h4>
        </div>
        <div className="settings-container-right">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <p className="settings-change-name">Cambiar nombre</p>
              <FormInput
                type="text"
                name="name"
                register={register}
                errors={errors}
                isSubmitted={isSubmitted}
                noIcon={true}
              >
                Noa
              </FormInput>
              <button className="settings-name-button" type="submit">
                Aplicar cambios
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="settings-main-container">
        <div className="settings-container-left">
          <h4 className="settings-title">Cuenta</h4>
        </div>
        <div className="settings-container-right">
          <ul className="settings-ul">
            <li className="settings-li">
              <a className="settings-link">Conectar cuenta de Steam</a>
            </li>
            <li className="settings-li">
              <a className="settings-link">Cambiar contraseña</a>
            </li>
            <li className="settings-li">
              <a className="settings-link">Cambiar E-mail</a>
            </li>
            <li className="settings-li">
              <a className="settings-link">Eliminar Perfil y Datos</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="settings-main-container">
        <div className="settings-container-left">
          <h4 className="settings-title">Gestionar Listas</h4>
        </div>
        <div className="settings-container-right">
          <div className="settings-container-list">
            <p>Eliminar Listas</p>
            <select className="form-select">
              <option>Elige una Lista..</option>
              <option>Playing</option>
            </select>
            <div className="input-wrapper">
              <input placeholder="Escribe ELIMINAR para borrar" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
