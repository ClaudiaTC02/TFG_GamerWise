import { useEffect, useRef, useState } from "react";
import { Modal } from "bootstrap";
import "../styles/ModalWindow.css";
import { useAuth } from "../hooks/useAuth";
import { getListAndCountedGamesLogic } from "../logic/listLogic";

export function ModalWindow({ onClose, gameName }) {
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
  }, [token]);

  const handleCheckboxChange = (listId) => {
    if (selectedItems.includes(listId)) {
      setSelectedItems(selectedItems.filter((id) => id !== listId));
    } else {
      setSelectedItems([...selectedItems, listId]);
    }
  };

  const handleListSelect = (listId) => {
    console.log("Seleccionaste la lista con ID:", listId);
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
              onClick={() => handleListSelect(list.id)}
            >
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  onChange={() => handleCheckboxChange(list.id)}
                  value=""
                  id={`listCheckbox${list.id}`}
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
            <p className="selected-list-modular">{selectedItems.length} listas seleccionadas</p>
            <button type="button" className="modal-add-button">
              Añadir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
