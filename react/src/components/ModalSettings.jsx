import Modal from "react-bootstrap/Modal";

import "../styles/ModalWindow.css";
import { FormInput } from "./FormInput";
import { useForm } from "react-hook-form";
import { updateEmailRequest } from "../api/user";
import { useState } from "react";

export function ModalEmail({ show, handleClose, token }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm();

  const [correctChange, setCorrectChange] = useState("")

  const handleChangeEmail = async (data) => {
    try {
      await updateEmailRequest(data.email, token);
      setCorrectChange("Cambiado con éxito")
    } catch (error) {
      console.log(error.message);
    }
    console.log("Cambiar email", data.email);
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
      </Modal.Footer>
    </Modal>
  );
}
