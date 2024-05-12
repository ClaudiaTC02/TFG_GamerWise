import Modal from "react-bootstrap/Modal";

import "../styles/ModalWindow.css";
import { FormInput } from "./FormInput";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { updateListRequest } from "../api/list";

export function ModalUpdateList({ show, handleClose, token, list, updateList}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    if (!show) {
      reset();
      setIcorrectChange(null);
      setCorrectChange(null);
      setValue("list_name", "");
      setValue("list_description", "");
    } else{
        setValue("list_name", list.name);
        setValue("list_description", list.description);
    }
  }, [show, reset, setValue, list.name, list.description]);

  const [incorrectChange, setIcorrectChange] = useState(null);
  const [correctChange, setCorrectChange] = useState(null);

  const handleUpdateList = async (data) => {
    try {
      let data_update = {};
      if (data.list_name !== list.name && data.list_name) {
        data_update.name = data.list_name;
      }
      if (data.list_description !== list.description) {
        data_update.description = data.list_description;
      }
      await updateListRequest(list.id, data_update, token);
      setIcorrectChange(null);
      setCorrectChange("Cambiado con éxito");
      const updated = {
        id: list.id,
        name: data_update.name ? data_update.name : list.name,
        description: data_update.description ? data_update.description : list.description,
      }
      updateList(updated)
    } catch (error) {
      setIcorrectChange(error.message);
      setCorrectChange(null);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Lista {list.name}</Modal.Title>
      </Modal.Header>
      <hr className="modal-hr" />
      <Modal.Body>
        <p className="modal-list-paragraph">Cambiar nombre de la lista</p>
        <FormInput
          type="text"
          name="list_name"
          register={register}
          errors={errors}
          isSubmitted={isSubmitted}
          noIcon={true}
        >
          {list.name}
        </FormInput>
        <p className="modal-list-paragraph">Cambiar descripción</p>
        <FormInput
          type="text"
          name="list_description"
          register={register}
          errors={errors}
          isSubmitted={isSubmitted}
          noIcon={true}
        >
          Descripción (opcional)
        </FormInput>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="submit"
          className="modal-add-button"
          onClick={handleSubmit(handleUpdateList)}
        >
          Cambiar
        </button>
        {correctChange && <p>{correctChange}</p>}
        {incorrectChange && <p>{incorrectChange}</p>}
      </Modal.Footer>
    </Modal>
  );
}
