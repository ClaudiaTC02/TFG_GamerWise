import { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { defaultCoverIcon, quitIcon, starFillIcon } from "./Icons";
import "../styles/ListGame.css";
import { deleteGameFromListRequest } from "../api/list";
import { useAuth } from "../hooks/useAuth";

export function ListGame({ game, list_id, updateGameList }) {
  const { token } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setShowConfirm(true);
  };

  const handleConfirmDelete = async (event) => {
    event.stopPropagation();
    try {
      await deleteGameFromListRequest(list_id, game.id, token);
      updateGameList(game.id);
    } catch (error) {
      console.log("No se pudo borrar el juego");
    } finally {
      setShowConfirm(false);
    }
  };

  const handleCancelDelete = (event) => {
    if (event) event.stopPropagation();
    setShowConfirm(false);
  };

  const coverUrl = game.cover
    ? game.cover.replace("t_thumb", "t_cover_big")
    : null;

  return (
    <>
      <Link
        to={`/game/${game.igdb_id}`}
        style={{ textDecoration: "none", color: "inherit", display: "block" }}
      >
        <div className="listgame-card">
          <div className="listgame-img-wrap">
            {coverUrl ? (
              <img alt={game.name} src={coverUrl} />
            ) : (
              <div className="listgame-no-cover">{defaultCoverIcon()}</div>
            )}
            <div className="listgame-overlay" />
            <div className="listgame-rating">
              <span className="listgame-star">{starFillIcon()}</span>
              {game.rating}
            </div>
            <button
              className="listgame-delete-btn"
              onClick={handleDeleteClick}
              aria-label={`Eliminar ${game.name} de la lista`}
            >
              {quitIcon()}
            </button>
          </div>
          <p className="listgame-name">{game.name}</p>
        </div>
      </Link>

      <Modal
        show={showConfirm}
        onHide={handleCancelDelete}
        dialogClassName="listgame-confirm-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <Modal.Header closeButton>
          <Modal.Title>Eliminar juego</Modal.Title>
        </Modal.Header>
        <hr className="modal-hr" />
        <Modal.Body>
          <p className="modal-confirm-text">
            ¿Seguro que quieres eliminar <strong>{game.name}</strong> de esta
            lista?
          </p>
          <div className="modal-delete-buttons">
            <button
              className="modal-btn modal-btn-cancel"
              onClick={handleCancelDelete}
            >
              Cancelar
            </button>
            <button
              className="modal-btn modal-btn-delete"
              onClick={handleConfirmDelete}
            >
              Eliminar
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
