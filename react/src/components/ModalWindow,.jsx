import { useEffect, useState } from "react";

import Modal from "react-bootstrap/Modal";

import "../styles/ModalWindow.css";
import { useAuth } from "../hooks/useAuth";
import {
  addGameToListLogic,
  getListAndCountedGamesLogic,
} from "../logic/listLogic";
import { ModalCreateList } from "./ModalLists";

export function ModalWindow({show, handleClose, gameName, igdb_id, gameDetails, onAddToLikeList  }) {
  const [lists, setLists] = useState([]);
  const [showList, setShowList] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const { token } = useAuth();
  const [add, setAdd] = useState(false)

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const listsData = await getListAndCountedGamesLogic(token, igdb_id);
        setLists(listsData);
      } catch (error) {
        console.error("Error fetching lists:", error);
      }
    };

    fetchLists();
  }, [token, igdb_id, add]);

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
        const list = lists.find((list) => list.id === listId);
        if (list.name === "Like") {
          onAddToLikeList();
        }
        await addGameToListLogic(listId, gameDetails, igdb_id, token);
        console.log(`Juego añadido a la lista con ID ${listId}`);
      }
      const checkboxes = document.querySelectorAll('.form-check-input');
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      })
      setSelectedItems([]);
      setAdd(!add)
    } catch (error) {
      console.error("Error al añadir el juego a la lista:", error);
    }
  };

  const filteredLists = lists.filter((list) =>
    list.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCloseList = () => setShowList(false);
  const handleShowList = () => setShowList(true);

  const handleCreateList = (event) => {
    event.preventDefault();
    handleShowList()
  }

  const handleUpdateList = (list) => {
    console.log(list)
    setAdd(!add)
  };


  const renderList = () => {
    if (filteredLists.length === 0) {
      return <p className="no-list-found-modular">No hay listas...</p>;
    } else {
      return (
        <ul className="list-group">
          {filteredLists.map((list) => (
            <li className="list-group-item" key={list.id}>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  onChange={() => handleCheckboxChange(list.id)}
                  value=""
                  id={`listCheckbox${list.id}`}
                  disabled={list.exists}
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
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Añade {gameName} a tu lista...</Modal.Title>
      </Modal.Header>
      <hr className="modal-hr" />
      <Modal.Body>
        <div className="modal-container">
          <a className="modal-newList" onClick={handleCreateList}>+ New List...</a>
          <input
            type="text"
            placeholder="Type to search..."
            className="modal-search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        {renderList()}
      </Modal.Body>
      <Modal.Footer>
        <p className="selected-list-modular">
          {selectedItems.length} listas seleccionadas
        </p>
        <button className="modal-add-button" onClick={handleAddToList}>
          Añadir
        </button>
      </Modal.Footer>
      <ModalCreateList show={showList} handleClose={handleCloseList} token={token} addList={handleUpdateList}/>
    </Modal>
  );
}
