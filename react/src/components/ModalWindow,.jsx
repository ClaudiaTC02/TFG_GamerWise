import { useEffect, useRef, useState } from "react";
import { Modal } from "bootstrap";
import "../styles/ModalWindow.css";
import { useAuth } from "../hooks/useAuth";
import {
  addGameToListLogic,
  checkIfGameExistsInListLogic,
  getListAndCountedGamesLogic,
} from "../logic/listLogic";

export function ModalWindow({ onClose, gameName, igdb_id, gameDetails }) {
  const modalRef = useRef(null);
  const [lists, setLists] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    const modalElement = modalRef.current;
    if (!modalElement) return;

    const modal = new Modal(modalElement);
    modal.show();

    return () => {
      modal.hide();
      modal.dispose();
    };
  }, [modalRef]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const listsData = await getListAndCountedGamesLogic(token);
        setLists(listsData);
      } catch (error) {
        console.error("Error fetching lists:", error);
      }
    };

    fetchLists();
  }, [token, selectedItems]);

  const handleCheckboxChange = (listId) => {
    if (selectedItems.includes(listId)) {
      setSelectedItems(selectedItems.filter((id) => id !== listId));
    } else {
      setSelectedItems([...selectedItems, listId]);
    }
  };

  const handleAddToList = async () => {
    try {
      for (const listId of selectedItems) {
        await addGameToListLogic(listId, gameDetails, igdb_id, token);
        console.log(`Juego añadido a la lista con ID ${listId}`);
      }
      setSelectedItems([]);
      const checkboxes = document.querySelectorAll(
        'input[type="checkbox"]:checked'
      );
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
    } catch (error) {
      console.error("Error al añadir el juego a la lista:", error);
    }
  };

  const filteredLists = lists.filter((list) =>
    list.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderList = () => {
    if (filteredLists.length === 0) {
      return <p className="no-list-found-modular">No hay listas...</p>;
    } else {
      return (
        <ul className="list-group">
          {filteredLists.map((list) => (
            <li
              className="list-group-item"
              key={list.id}
            >
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  onChange={() => handleCheckboxChange(list.id)}
                  value=""
                  id={`listCheckbox${list.id}`}
                  disabled={checkIfGameExistsInListLogic(list.id, token, igdb_id)}
                />
                <div className="labels-container">
                  <label
                    className="form-check-label"
                    htmlFor={`listCheckbox${list.id}`}
                  >
                    {list.name}
                  </label>
                  <label
                    className="form-check-label"
                    htmlFor={`listCheckbox${list.id}`}
                  >
                    {list.count} {"games"}
                  </label>
                </div>
              </div>
            </li>
          ))}
        </ul>
      );
    }
  };

  return (
    <div
      className="modal fade"
      id="staticBackdrop"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
      ref={modalRef}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title" id="staticBackdropLabel">
              Añade {gameName} a tu lista...
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <hr className="modal-hr" />
          <div className="modal-body">
            <div className="modal-container">
              <p className="modal-newList">+ New List...</p>
              <input
                type="text"
                placeholder="Type to search..."
                className="modal-search"
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            {renderList()}
          </div>
          <div className="modal-footer">
            <p className="selected-list-modular">
              {selectedItems.length} listas seleccionadas
            </p>
            <button
              type="button"
              className="modal-add-button"
              onClick={handleAddToList}
            >
              Añadir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
