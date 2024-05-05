import { useForm } from "react-hook-form";
import { FormInput } from "./FormInput";
import "../styles/SettingsProfile.css";
import { updateNameRequest } from "../api/user";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { deleteListRequest, getAllListOfUserRequest } from "../api/list";
import { ModalDeleteAccount, ModalEmail, ModalPassowrd } from "./ModalSettings";

export function SettingsProfile({ updateUser }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm();
  const [lists, setLists] = useState();
  const { token } = useAuth();
  const [selectedList, setSelectedList] = useState("");
  const [deleteInput, setDeleteInput] = useState("");

  useEffect(() => {
    const forbiddenNames = ["Playing", "Completed", "Like", "Dropped"];
    const fetchData = async () => {
      try {
        const lists = await getAllListOfUserRequest(token);
        const filteredLists = lists.filter(
          (list) => !forbiddenNames.includes(list.name)
        );
        setLists(filteredLists);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [token, lists]);

  // Modal
  const [showEmail, setShowEmail] = useState(false);
  const [showPasword, setShowPassword] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleCloseEmail = () => setShowEmail(false);
  const handleShowEmail = () => setShowEmail(true);
  const handleClosePassword = () => setShowPassword(false);
  const handleShowPassword = () => setShowPassword(true);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);

  const onSubmit = async (data) => {
    try {
      await updateNameRequest(data.name, token);
      updateUser(data.name);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleListChange = (event) => {
    setSelectedList(event.target.value);
  };

  const handleInputChange = (event) => {
    setDeleteInput(event.target.value);
  };

  const handleDeleteList = async () => {
    const id = selectedList;
    if (deleteInput === "ELIMINAR") {
      try {
        await deleteListRequest(id, token);
        setDeleteInput("");
        setSelectedList("");
        const updatedLists = lists.filter(list => list.id !== id);
        setLists(updatedLists);
      } catch (error) {
        console.log("Algo salió mal");
      }
    } else {
      console.log(
        "Por favor, escribe 'ELIMINAR' para confirmar la eliminación."
      );
    }
  };

  const handleOpenModalEmail = () => {
    handleShowEmail()
  };

  const handleOpenModalPasword = () => {
    handleShowPassword()
  };

  const handleOpenModalDelete = () => {
    handleShowDelete()
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
                style_error={{ "margin-left": '20px', "margin-bottom":"0.2rem" }}
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
            <li className="settings-li" onClick={handleOpenModalPasword}>
              <a className="settings-link">Cambiar contraseña</a>
            </li>
            <li className="settings-li"  onClick={handleOpenModalEmail}>
              <a className="settings-link">Cambiar E-mail</a>
            </li>
            <li className="settings-li" onClick={handleOpenModalDelete}>
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
            <p className="settings-change-name">Eliminar Listas</p>
            <select
              className="form-select"
              value={selectedList}
              onChange={handleListChange}
            >
              <option>Elige una Lista..</option>
              {lists &&
                lists.map((list) => <option value={list.id} key={list.id}>{list.name}</option>)}
            </select>
            <div className="input-wrapper">
              <input
                placeholder="Escribe ELIMINAR para borrar"
                value={deleteInput}
                onChange={handleInputChange}
              />
            </div>
            <button className="settings-name-button" onClick={handleDeleteList}>
              Eliminar
            </button>
          </div>
        </div>
      </div>
      <ModalEmail show={showEmail} handleClose={handleCloseEmail} token={token}/>
      <ModalPassowrd show={showPasword} handleClose={handleClosePassword} token={token}/>
      <ModalDeleteAccount show={showDelete} handleClose={handleCloseDelete} token={token}/>
    </section>
  );
}
