import Modal from "react-bootstrap/Modal";

import "../styles/ModalWindow.css";
import { FormInput } from "./FormInput";
import { useForm } from "react-hook-form";
import {
  deleteAccountRequest,
  updateEmailRequest,
  updatePasswordRequest,
} from "../api/user";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export function ModalEmail({ show, handleClose, token }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
    setValue
  } = useForm();

  useEffect(() => {
    if (!show) {
      reset(); 
      setIcorrectChange(null); 
      setCorrectChange(null);
      setValue("email", "");
    }
  }, [show, reset, setValue]);

  const [incorrectChange, setIcorrectChange] = useState(null);
  const [correctChange, setCorrectChange] = useState(null);

  const handleChangeEmail = async (data) => {
    try {
      await updateEmailRequest(data.email, token);
      setIcorrectChange(null);
      setCorrectChange("Cambiado con éxito");
    } catch (error) {
      setIcorrectChange(error.message);
      setCorrectChange(null);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Cambiar Email</Modal.Title>
      </Modal.Header>
      <hr className="modal-hr" />
      <Modal.Body>
        <FormInput
          type="email"
          name="email"
          register={register}
          errors={errors}
          isSubmitted={isSubmitted}
          noIcon={true}
        >
          Nuevo correo electrónico
        </FormInput>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="submit"
          className="modal-add-button"
          onClick={handleSubmit(handleChangeEmail)}
        >
          Cambiar
        </button>
        {correctChange && <p>{correctChange}</p>}
        {incorrectChange && <p>{incorrectChange}</p>}
      </Modal.Footer>
    </Modal>
  );
}

export function ModalPassowrd({ show, handleClose, token }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitted },
    reset,
    setValue
  } = useForm();

  useEffect(() => {
    if (!show) {
      reset(); 
      setIcorrectChange(null); 
      setCorrectChange(null);
      setValue("password", "");
      setValue("password_actual", "");
      setValue("password-repeat", "");
    }
  }, [show, reset, setValue]);
  

  const [incorrectChange, setIcorrectChange] = useState(null);
  const [correctChange, setCorrectChange] = useState(null);

  const handleChangePassword = async (data) => {
    try {
      await updatePasswordRequest(data.password, data.password_actual, token);
      setIcorrectChange(null);
      setCorrectChange("Se ha cambiado la contraseña correctamente");
    } catch (error) {
      setCorrectChange(null);
      setIcorrectChange(error.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Cambiar Contraseña</Modal.Title>
      </Modal.Header>
      <hr className="modal-hr" />
      <Modal.Body>
        <FormInput
          type="password"
          name="password"
          register={register}
          errors={errors}
          isSubmitted={isSubmitted}
          noIcon={true}
        >
          Nueva contraseña
        </FormInput>
        <FormInput
          type="password"
          name="password-repeat"
          register={register}
          errors={errors}
          isSubmitted={isSubmitted}
          noIcon={true}
          passwordValue={watch("password")}
        >
          Repite la nueva contraseña
        </FormInput>
        <FormInput
          type="password"
          name="password_actual"
          register={register}
          errors={errors}
          isSubmitted={isSubmitted}
          noIcon={true}
        >
          Contraseña actual
        </FormInput>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="submit"
          className="modal-add-button"
          onClick={handleSubmit(handleChangePassword)}
        >
          Cambiar
        </button>
        {correctChange && <p>{correctChange}</p>}
        {incorrectChange && <p>{incorrectChange}</p>}
      </Modal.Footer>
    </Modal>
  );
}

export function ModalDeleteAccount({ show, handleClose, token }) {
  const [incorrectChange, setIcorrectChange] = useState(null);
  const { signOut } = useAuth();

  const handleDeleteAccount = async () => {
    try {
      await deleteAccountRequest(token);
      signOut();
    } catch (error) {
      setIcorrectChange(error.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <div>
          <Modal.Title>Zona de Peligro</Modal.Title>
          <p className="modal-delete-paragraph">
            No habrá marcha atrás si continuas
          </p>
        </div>
      </Modal.Header>
      <hr className="modal-hr" />
      <Modal.Body>
        <div className="modal-delete-buttons">
          <button
            type="submit"
            className="btn btn-danger"
            onClick={handleDeleteAccount}
          >
            Eliminar
          </button>
          <button
            type="submit"
            className="btn btn-secondary"
            onClick={handleClose}
          >
            Cancelar
          </button>
        </div>
      </Modal.Body>
      <Modal.Footer>{incorrectChange && <p>{incorrectChange}</p>}</Modal.Footer>
    </Modal>
  );
}
