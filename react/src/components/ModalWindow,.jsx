import { useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import "../styles/ModalWindow.css";

export function ModalWindow({ onClose, gameName }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const modal = new Modal(modalRef.current);
    modal.show();
    return () => {
      modal.dispose();
    };
  }, [modalRef]);

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
            <div className="modal-search-container">
              <p className="modal-newList">+ New List...</p>
              <input type="text" placeholder="Type to search" />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="modal-add-button">Añadir</button>
          </div>
        </div>
      </div>
    </div>
  );
}
